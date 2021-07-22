import type { Input } from './types';
import type { DecoderExtension } from './ext/types';
import { timestampDecoder } from './ext/TimestampDecoder';

type DecodeProcessResult<ExtensionType extends object> = [
  input: Input<ExtensionType>,
  readBytes: number,
];

type DecodeProcessFn<ExtensionType extends object> = (dataArray: Uint8Array, pos?: number) => DecodeProcessResult<ExtensionType>;

type DecodeFn<ExtensionType extends object> = (dataArray: Uint8Array) => Input<ExtensionType>;

type DecoderOptions<ExtensionType extends object> = {
  decoderExtensions?: Array<DecoderExtension<ExtensionType>>,
};

export function makeMessagePackDecoder<ExtensionType extends object = object>({
  decoderExtensions = [],
}: DecoderOptions<ExtensionType> = {}): {
  decode: DecodeFn<ExtensionType>,
} {
  let textDecoder = new TextDecoder();

  const decodeArrayItems = (input: Uint8Array, len: number) => {
    let acc = 0;
    let array: Array<Input<ExtensionType>> = Array(len);
    for (let i = 0; i < len; i++) {
      let [item, readBytes] = decode(input.slice(acc), acc);
      array[i] = item;
      acc += readBytes;
    }
    return [array, acc] as const;
  };

  const decodeObjectEntries = (input: Uint8Array, size: number, pos = 0) => {
    let acc = 0;
    let entries: Array<[key: string, value: Input<ExtensionType>]> = Array(size);
    for (let i = 0; i < size; i++) {
      let [key, keySize] = decode(input.slice(acc), pos + acc);
      if (typeof key !== 'string') {
        throw new Error(`expected string at ${pos}, but got ${typeof key}`);
      }
      acc += keySize;

      let [value, valueSize] = decode(input.slice(acc), pos + acc);
      acc += valueSize;

      entries[i] = [key, value];
    }

    return [Object.fromEntries(entries), acc] as const;
  };

  const decode: DecodeProcessFn<ExtensionType> = (input: Uint8Array, pos = 0) => {
    let acc = 0;
    let header = input[acc++];

    if (header < 0x80) {
      return [header, acc];
    } else if (header < 0x90) {
      let len = header & 15;
      let [data, readBytes] = decodeObjectEntries(input.slice(acc), len, pos + acc);
      return [data, acc + readBytes];
    } else if (header < 0xa0) {
      let len = header & 15;
      let [data, readBytes] = decodeArrayItems(input.slice(acc), len);
      return [data, acc + readBytes];
    } else if (header < 0xc0) {
      let len = 0x1f & header;
      let str = textDecoder.decode(input.slice(acc, acc + len));
      return [str, acc + len];
    } else if (header === 0xc0) {
      return [null, acc];
    } else if (header === 0xc1) {
      throw new Error('header 0xc1 is never used');
    } else if (header === 0xc2) {
      return [false, acc];
    } else if (header === 0xc3) {
      return [true, acc];
    } else if (header === 0xc4) {
      let len = input[acc++];
      let bin = input.slice(acc, acc + len);
      return [bin, acc + len];
    } else if (header === 0xc5) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint16(0, false);
      acc += 2;
      let data = input.slice(acc, acc + len);
      return [data, acc + len];
    } else if (header === 0xc6) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint32(0, false);
      acc += 4;
      let data = input.slice(acc, acc + len);
      return [data, acc + len];
    } else if (header === 0xc7) {
      let view = new DataView(input.buffer);
      let len = view.getUint8(acc++);
      let type = view.getInt8(acc++);
      if (type === timestampDecoder.type) {
        let [data, readBytes] = timestampDecoder.decode(input.slice(acc), len);
        return [data, acc + readBytes];
      }
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), len);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xc8) {
      let view = new DataView(input.buffer);
      let len = view.getUint16(acc, false); acc += 2;
      let type = view.getUint8(acc++);
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), len);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xc9) {
      let view = new DataView(input.buffer);
      let len = view.getUint32(acc, false); acc += 4;
      let type = view.getUint8(acc++);
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), len);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xca) {
      let view = new DataView(input.buffer, acc);
      let data = view.getFloat32(0, false);
      return [data, acc + 4];
    } else if (header === 0xcb) {
      let view = new DataView(input.buffer, acc);
      let data = view.getFloat64(0, false);
      return [data, acc + 8];
    } else if (header === 0xcc) {
      let data = input[acc++];
      return [data, acc];
    } else if (header === 0xcd) {
      let view = new DataView(input.buffer, acc);
      let data = view.getUint16(0, false);
      return [data, acc + 2];
    } else if (header === 0xce) {
      let view = new DataView(input.buffer, acc);
      let data = view.getUint32(0, false);
      return [data, acc + 4];
    } else if (header === 0xcf) {
      let view = new DataView(input.buffer, acc);
      let hi = view.getUint32(0, false);
      let lo = view.getUint32(4, false);
      let data = (hi * Math.pow(256, 4)) + lo;
      return [data, acc + 8];
    } else if (header === 0xd0) {
      let view = new DataView(input.buffer, acc);
      return [view.getInt8(0), acc + 1];
    } else if (header === 0xd1) {
      let view = new DataView(input.buffer, acc);
      let data = view.getInt16(0, false);
      return [data, acc + 2];
    } else if (header === 0xd2) {
      let view = new DataView(input.buffer, acc);
      let data = view.getInt32(0, false);
      return [data, acc + 4];
    } else if (header === 0xd3) {
      let carry = 1;
      for (let i = 8; i >= 1; i--) {
        const v = (input[i] ^ 0xff) + carry;
        input[i] = v & 0xff;
        carry = v >> 8;
      }
      let view = new DataView(input.buffer, acc);
      let hi = view.getUint32(0, false);
      let lo = view.getUint32(4, false);
      let data = -((hi * Math.pow(256, 4)) + lo);
      return [data, acc + 8];
    } else if (header === 0xd4) {
      let view = new DataView(input.buffer);
      let type = view.getInt8(acc++);
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xd5) {
      let view = new DataView(input.buffer);
      let type = view.getInt8(acc++);
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), 1);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xd6) {
      let view = new DataView(input.buffer);
      let type = view.getInt8(acc++);
      if (type === timestampDecoder.type) {
        let [data, readBytes] = timestampDecoder.decode(input.slice(acc), 4);
        return [data, acc + readBytes];
      }
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), 4);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xd7) {
      let view = new DataView(input.buffer);
      let type = view.getInt8(acc++);
      if (type === timestampDecoder.type) {
        let [data, readBytes] = timestampDecoder.decode(input.slice(acc), 8);
        return [data, acc + readBytes];
      }
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), 8);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xd8) {
      let view = new DataView(input.buffer);
      let type = view.getInt8(acc++);
      for (let ext of decoderExtensions) {
        if (type === ext.type) {
          let [data, readBytes] = ext.decode(input.slice(acc), 16);
          return [data, acc + readBytes];
        }
      }
      throw new Error(`unknown extension type ${type}`);
    } else if (header === 0xd9) {
      let len = input[acc++];
      let data = textDecoder.decode(input.slice(acc));
      return [data, acc + len];
    } else if (header === 0xda) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint16(0, false);
      acc += 2;
      let data = textDecoder.decode(input.slice(acc));
      return [data, acc + len];
    } else if (header === 0xdb) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint32(0, false);
      acc += 4;
      let data = textDecoder.decode(input.slice(acc));
      return [data, acc + len];
    } else if (header === 0xdc) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint16(0, false); acc += 2;
      let [array, readBytes] = decodeArrayItems(input.slice(acc), len);
      return [array, acc + readBytes];
    } else if (header === 0xdd) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint32(0, false); acc += 4;
      let [array, readBytes] = decodeArrayItems(input.slice(acc), len);
      return [array, acc + readBytes];
    } else if (header === 0xde) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint16(0, false); acc += 2;
      let [data, readBytes] = decodeObjectEntries(input.slice(acc), len, pos + acc);
      return [data, acc + readBytes];
    } else if (header === 0xdf) {
      let view = new DataView(input.buffer, acc);
      let len = view.getUint32(0, false); acc += 4;
      let [data, readBytes] = decodeObjectEntries(input.slice(acc), len, pos + acc);
      return [data, acc + readBytes];
    } else if (header < 0x100) {
      return [~(header ^ 255), acc];
    }

    throw new Error(`unknown header ${header} at ${pos}`);
  };

  return {
    decode: input => {
      let [data, readBytes] = decode(input, 0);
      if (readBytes !== input.length) {
        throw new Error(`invalid input length, expected ${input.length}, but got ${readBytes}`);
      }
      return data;
    },
  };
}
