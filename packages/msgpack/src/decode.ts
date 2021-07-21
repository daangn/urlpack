import type { Input } from './types';

interface Decode {
  (input: Uint8Array): Input;
}

export const decode: Decode = input => {
  let [header] = input;
  let view = new DataView(input.buffer, 1);

  if (header < 0x80) {
    return header;
  } else if (header < 0x90) {
    return null;
  } else if (header < 0xa0) {
    return null;
  } else if (header < 0xc0) {
    const length = 0x1f & header;
    return new TextDecoder().decode(input.slice(1, length + 1));
  } else if (header === 0xc0) {
    return null;
  } else if (header === 0xc1) {
    return null;
  } else if (header === 0xc2) {
    return false;
  } else if (header === 0xc3) {
    return true;
  } else if (header === 0xc4) {
    const length = input[1];
    return input.slice(2, length + 2);
  } else if (header === 0xc5) {
    const length = view.getUint16(0, false);
    return input.slice(3, length + 3);
  } else if (header === 0xc6) {
    const length = view.getUint32(0, false);
    return input.slice(5, length + 5);
  } else if (header === 0xc7) {
    return null;
  } else if (header === 0xc8) {
    return null;
  } else if (header === 0xc9) {
    return null;
  } else if (header === 0xca) {
    return view.getFloat32(0, false);
  } else if (header === 0xcb) {
    return view.getFloat64(0, false);
  } else if (header === 0xcc) {
    return input[1];
  } else if (header === 0xcd) {
    return view.getUint16(0, false);
  } else if (header === 0xce) {
    return view.getUint32(0, false);
  } else if (header === 0xcf) {
    const hi = view.getUint32(0, false);
    const lo = view.getUint32(4, false);
    return (hi * Math.pow(256, 4)) + lo;
  } else if (header === 0xd0) {
    return view.getInt8(0);
  } else if (header === 0xd1) {
    return view.getInt16(0, false);
  } else if (header === 0xd2) {
    return view.getInt32(0, false);
  } else if (header === 0xd3) {
    let carry = 1;
    for (let i = 8; i >= 1; i--) {
      const v = (input[i] ^ 0xff) + carry;
      input[i] = v & 0xff;
      carry = v >> 8;
    }
    const hi = view.getUint32(0, false);
    const lo = view.getUint32(4, false);
    return -((hi * Math.pow(256, 4)) + lo);
  } else if (header === 0xd4) {
    return null;
  } else if (header === 0xd5) {
    return null;
  } else if (header === 0xd6) {
    return null;
  } else if (header === 0xd7) {
    return null;
  } else if (header === 0xd8) {
    return null;
  } else if (header === 0xd9) {
    const length = input[1];
    return new TextDecoder().decode(input.slice(2, length + 2));
  } else if (header === 0xda) {
    const length = view.getUint16(0, false);
    return new TextDecoder().decode(input.slice(3, length + 3));
  } else if (header === 0xdb) {
    const length = view.getUint32(0, false);
    return new TextDecoder().decode(input.slice(5, length + 5));
  } else if (header === 0xdc) {
    return null;
  } else if (header === 0xdd) {
    return null;
  } else if (header === 0xde) {
    return null;
  } else if (header === 0xdf) {
    return null;
  } else if (header < 0x100) {
    return -((header ^ 0xff) + 1);
  }

  return '';
};
