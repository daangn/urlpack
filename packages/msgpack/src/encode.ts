import type { Input } from './types';

interface Encode {
  (input: Input): Uint8Array;
}

let textEncoder = new TextEncoder();
let isFloat = (num: number) => num % 1 > 0;
let uint64bound = 0x100000000;

const numberUint8Array = (input: number, bits: 8 | 16 | 32 | 64, header?: number) => {
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
    let lo = input % uint64bound;
    let hi = input / uint64bound | 0;

    for (let i = 24; i >= 0; i -= 8) {
      array[cursor++] = 0xff & (hi >> i);
    }

    for (let i = 24; i >= 0; i -= 8) {
      array[cursor++] = 0xff & (lo >> i);
    }
  }

  return array;
};

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
    } else if (input < 256) {
      return numberUint8Array(input, 8, 0xcc);
    } else if (input < 65536) {
      return numberUint8Array(input, 16, 0xcd);
    } else if (input < uint64bound) {
      return numberUint8Array(input, 32, 0xce);
    } else if (input <= 9007199254740991) {
      return numberUint8Array(input, 64, 0xcf);
    } else {
      return encodeFloat(input, true);
    }

  } else {
    if (input >= -32) {
      return numberUint8Array((256 + input), 8);
    } else if (input >= -128) {
      return numberUint8Array(input, 8, 0xd0);
    } else if (input >= -32768) {
      return numberUint8Array(input, 16, 0xd1);
    } else if (input >= -214748364) {
      return numberUint8Array(input, 32, 0xd2);
    } else if (input >= -9007199254740991) {
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
    }
  }

  return new Uint8Array();
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
  } else if (len < uint64bound) {
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
  if (input.length < 256) {
    return new Uint8Array([0xc4, input.length, ...input]);
  } else if (input.length < 65536) {
    return new Uint8Array([0xc5, 0xff & (input.length >> 8), 0xff & input.length, ...input]);
  } else if (input.length < uint64bound) {
    return new Uint8Array([0xc6, 0xff & (input.length >> 24), 0xff & (input.length >> 16), 0xff & (input.length >> 8), 0xff & input.length, ...input]);
  }

  return new Uint8Array();
};

export const encode: Encode = input => {
  if (typeof input === 'string') {
    return encodeString(input);
  }

  if (input === null) {
    return new Uint8Array([0xC0]);
  }

  if (input === false) {
    return new Uint8Array([0xC2]);
  }

  if (input === true) {
    return new Uint8Array([0xC3]);
  }

  if (typeof input === 'number') {
    if (isFloat(input)) {
      return encodeFloat(input);
    } else {
      return encodeInteger(input);
    }
  }

  if (input instanceof Uint8Array) {
    return encodeBinary(input);
  }

  return new Uint8Array();
};
