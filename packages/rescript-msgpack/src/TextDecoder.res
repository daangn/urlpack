open Js.TypedArray2

type t

@new external make: unit => t = "TextDecoder"
@send external decode: (t, Uint8Array.t) => string = "decode"

/**
 * Borrowing from https://github.com/msgpack/msgpack-javascript/blob/c58b7e2/src/utils/utf8.ts#L110-L157
 *
 * Note:
 *   The Node.js builtin TextDecoder is seriously slow.
 *   This custom decoder is 10~12x faster than the builtin
 *
 * See benchmarks/utf8-decode.cjs
 */
let decode2: (t, Uint8Array.t) => string = %raw(`(_t, bytes) => {
  let offset = 0;
  let end = bytes.length;

  let units = [];
  let result = "";
  while (offset < end) {
    let byte1 = bytes[offset++];
    if ((byte1 & 0x80) === 0) {
      // 1 byte
      units.push(byte1);
    } else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      let byte2 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 6) | byte2);
    } else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      let byte2 = bytes[offset++] & 0x3f;
      let byte3 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    } else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      let byte2 = bytes[offset++] & 0x3f;
      let byte3 = bytes[offset++] & 0x3f;
      let byte4 = bytes[offset++] & 0x3f;
      let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (unit > 0xffff) {
        unit -= 0x10000;
        units.push(((unit >>> 10) & 0x3ff) | 0xd800);
        unit = 0xdc00 | (unit & 0x3ff);
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }

    if (units.length >= 0x1_000) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }

  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }

  return result;
}`)
