import type { Input } from './types';
import { isFloat } from './utils';
import type { EncoderExtension } from './ext/types';
import { timestampEncoder } from './ext/TimestampEncoder';

let uint16min = 0x100;
let uint32min = 0x10000;
let uint64min = 0x100000000;

type EncodeFn<InputType> = (input: InputType) => Uint8Array;

type EncoderOptions<ExtensionType extends object> = {
  encoderExtensions?: Array<EncoderExtension<ExtensionType>>,
};

export function makeMessagePackEncoder<ExtensionType extends object = object>({
  encoderExtensions = [],
}: EncoderOptions<ExtensionType> = {}): {
  encode: EncodeFn<Input<ExtensionType>>,
} {
  let textEncoder = new TextEncoder();

  const encodeFloat = (input: number, force64 = false) => {
    let is64 = force64 || Math.fround(input) !== input;
    let array = new Uint8Array(is64 ? 9 : 5);
    let view = new DataView(array.buffer);
    if (is64) {
      array[0] = 0xcb;
      view.setFloat64(1, input, false);
    } else {
      array[0] = 0xca;
      view.setFloat32(1, input, false);
    }
    return array;
  };

  const encodeInteger = (input: number) => {
    if (input === 0) {
      return new Uint8Array([0]);

    } else if (input > 0) {
      if (input < 128) {
        return numberUint8Array(input, 8);
      } else if (input < uint16min) {
        return numberUint8Array(input, 8, 0xcc);
      } else if (input < uint32min) {
        return numberUint8Array(input, 16, 0xcd);
      } else if (input < uint64min) {
        return numberUint8Array(input, 32, 0xce);
      } else if (input <= Number.MAX_SAFE_INTEGER) {
        return numberUint8Array(input, 64, 0xcf);
      } else {
        throw new Error('number is lager than 2^53, try bigint');
      }

    } else {
      if (input >= -32) {
        return numberUint8Array((uint16min + input), 8);
      } else if (input >= -uint16min / 2) {
        return numberUint8Array(input, 8, 0xd0);
      } else if (input >= -uint32min / 2) {
        return numberUint8Array(input, 16, 0xd1);
      } else if (input >= -uint64min / 2) {
        return numberUint8Array(input, 32, 0xd2);
      } else if (input >= Number.MIN_SAFE_INTEGER) {
        let absArray = numberUint8Array(Math.abs(input), 64, 0xd3);
        let i = absArray.length;

        while (i-- > 1) {
          if (absArray[i] !== 0) {
            absArray[i] = (absArray[i] ^ 0xff) + 1;
            break;
          }
        }

        while (i-- > 1) {
          absArray[i] = absArray[i] ^ 0xff;
        }

        return absArray;
      } else {
        throw new Error('number is smaller than -2^53, try bigint');
      }
    }
  };

  const encodeBigInt = (input: bigint) => {
    if (input === BigInt(0)) {
      // zero is zero
      return new Uint8Array([0]);

    } else if (input > 0) {
      // treat positive bigint as unsigned int64

      let array = new Uint8Array(9);
      array[0] = 0xcf;

      let view = new DataView(array.buffer, 1);
      view.setBigUint64(0, input, false);

      return array;
    } else {
      // treat negative bigint as signed int64

      let array = new Uint8Array(9);
      array[0] = 0xd3;

      let view = new DataView(array.buffer, 1);
      view.setBigInt64(0, input, false);

      return array;
    }
  };

  const encodeString = (input: string) => {
    let array: Uint8Array;
    let buffer = textEncoder.encode(input);
    let len = buffer.length;

    if (len < 32) {
      array = new Uint8Array(1 + len);
      array[0] = 0xa0 | len;
      array.set(buffer, 1);
    } else if (len < 256) {
      array = new Uint8Array(2 + len);
      array[0] = 0xd9;
      array[1] = len;
      array.set(buffer, 2);
    } else if (len < 65536) {
      array = new Uint8Array(3 + len);
      array[0] = 0xda;
      array[1] = 0xff & (len >> 8);
      array[2] = 0xff & len;
      array.set(buffer, 3);
    } else if (len < uint64min) {
      array = new Uint8Array(5 + len);
      array[0] = 0xdb;
      array[1] = 0xff & (len >> 24);
      array[2] = 0xff & (len >> 16);
      array[3] = 0xff & (len >> 8);
      array[4] = 0xff & len;
      array.set(buffer, 5);
    } else {
      array = new Uint8Array();
    }
    return array;
  };

  const encodeBinary = (input: Uint8Array) => {
    let buf: Uint8Array;
    let len = input.length;
    if (len < 256) {
      buf = new Uint8Array(2 + len);
      buf[0] = 0xc4;
      buf[1] = len;
      buf.set(input, 2);
    } else if (len < 65536) {
      buf = new Uint8Array(3 + len);
      buf[0] = 0xc5;
      buf[1] = len >> 8;
      buf[2] = 0xff & len;
      buf.set(input, 3);
    } else if (len < uint64min) {
      buf = new Uint8Array(5 + len);
      buf[0] = 0xc6;
      buf[1] = 0xff & (len >> 24);
      buf[2] = 0xff & (len >> 16);
      buf[3] = 0xff & (len >> 8);
      buf[4] = 0xff & len;
      buf.set(input, 5);
    } else {
      buf = new Uint8Array();
    }
    return buf;
  };

  const encodeArray = (items: Input<ExtensionType>[]) => {
    let itemLen = items.length;
    let bufLen = 0;
    let cache = Array<Uint8Array>(itemLen);
    for (let i = 0; i < itemLen; i++) {
      let buf = encode(items[i]);
      cache[i] = buf;
      bufLen += buf.length;
    }

    let array: Uint8Array;
    let offset = 0;
    if (itemLen < 16) {
      offset = 1;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0x90 | itemLen;
    } else if (itemLen < 65536) {
      offset = 3;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0xdc;
      array[1] = 0xff & (itemLen >> 8);
      array[2] = 0xff & itemLen;
    } else if (itemLen < 4294967296) {
      offset = 5;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0xdd;
      array[1] = 0xff & (itemLen >> 24);
      array[2] = 0xff & (itemLen >> 16);
      array[3] = 0xff & (itemLen >> 8);
      array[4] = 0xff & itemLen;
    } else {
      throw new Error('array length is too long');
    }

    for (let subarray of cache) {
      for (let i = 0; i < subarray.length; i++) {
        array[offset++] = subarray[i];
      }
    }

    return array;
  };

  const encodeMap = (input: { [key: string]: Input<ExtensionType> } | ExtensionType) => {
    let entries = Object.entries(input);
    let entriesLen = entries.length;
    let keyCache = Array<Uint8Array>(entriesLen);
    let valCache = Array<Uint8Array>(entriesLen);
    let bufLen = 0;
    for (let i = 0; i < entriesLen; i++) {
      let [key, value] = entries[i];

      let keyBuf = encodeString(key);
      keyCache[i] = keyBuf;

      let valueBuf = encode(value);
      valCache[i] = valueBuf;

      bufLen += keyBuf.length + valueBuf.length;
    }

    let array: Uint8Array;
    let offset = 0;
    if (entriesLen < 16) {
      offset = 1;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0x80 | entriesLen;
    } else if (entriesLen < 65536) {
      offset = 3;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0xde;
      array[1] = 0xff & (entriesLen >> 8);
      array[2] = 0xff & entriesLen;
    } else if (entriesLen < 4294967296) {
      offset = 5;
      array = new Uint8Array(offset + bufLen);
      array[0] = 0xdf;
      array[1] = 0xff & (entriesLen >> 24);
      array[2] = 0xff & (entriesLen >> 16);
      array[3] = 0xff & (entriesLen >> 8);
      array[4] = 0xff & entriesLen;
    } else {
      throw new Error('map size is too big');
    }

    for (let i = 0; i < entriesLen; i++) {
      array.set(keyCache[i], offset);
      offset += keyCache[i].length;

      array.set(valCache[i], offset);
      offset += valCache[i].length;
    }

    return array;
  };

  let encode = (input: Input<ExtensionType>) => {
    if (typeof input === 'string') {
      return encodeString(input);
    }

    if (Array.isArray(input)) {
      return encodeArray(input);
    }

    if (input instanceof Uint8Array) {
      return encodeBinary(input);
    } else if (input === null) {
      return new Uint8Array([0xc0]);
    } else if (typeof input === 'object') {
      if (timestampEncoder.check(input)) {
        return timestampEncoder.encode(input);
      }
      for (let ext of encoderExtensions) {
        if (ext.check(input)) {
          return ext.encode(input);
        }
      }
      return encodeMap(input);
    }

    if (input === false) {
      return new Uint8Array([0xc2]);
    }

    if (input === true) {
      return new Uint8Array([0xc3]);
    }

    if (typeof input === 'number') {
      if (isFloat(input)) {
        return encodeFloat(input);
      } else {
        return encodeInteger(input);
      }
    }

    if (typeof input === 'bigint') {
      return encodeBigInt(input);
    }

    return new Uint8Array();
  };

  return { encode };
}

let numberUint8Array = (input: number, bits: 8 | 16 | 32 | 64, header?: number) => {
  let array = new Uint8Array((bits >> 3) + (header ? 1 : 0));
  let cursor = 0;

  if (header) {
    array[cursor++] = header;
  }

  if (bits < 64) {
    for (let i = bits - 8; i >= 0; i -= 8) {
      array[cursor++] = 0xff & (input >> i);
    }
  } else {
    let lo = input % uint64min;
    let hi = input / uint64min | 0;

    for (let i = 24; i >= 0; i -= 8) {
      array[cursor++] = 0xff & (hi >> i);
    }

    for (let i = 24; i >= 0; i -= 8) {
      array[cursor++] = 0xff & (lo >> i);
    }
  }

  return array;
};
