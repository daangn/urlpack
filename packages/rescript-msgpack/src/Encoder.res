open Js.TypedArray2
open Extension

module TextEncoder = {
  type t

  @new external make: unit => t = "TextEncoder"
  @send external encode: (t, string) => Uint8Array.t = "encode"

  /**
   * Borrowing from https://github.com/msgpack/msgpack-javascript/blob/c58b7e2/src/utils/utf8.ts#L48-L89
   *
   * Note:
   *   The Node.js builtin TextEncoder is seriously slow.
   *   This custom decoder is ~5x faster than the builtin
   *
   * See benchmarks/utf8-encode.cjs
   */
  let encode2: (t, string) => Uint8Array.t = %raw(`(_t, str) => {
    let strLength = str.length;
    let output = [];
    let offset = 0;
    let pos = 0;
    while (pos < strLength) {
      let value = str.charCodeAt(pos++);

      if ((value & 0xffffff80) === 0) {
        // 1-byte
        output[offset++] = value;
        continue;
      } else if ((value & 0xfffff800) === 0) {
        // 2-bytes
        output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
      } else {
        // handle surrogate pair
        if (value >= 0xd800 && value <= 0xdbff) {
          // high surrogate
          if (pos < strLength) {
            let extra = str.charCodeAt(pos);
            if ((extra & 0xfc00) === 0xdc00) {
              ++pos;
              value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
            }
          }
        }

        if ((value & 0xffff0000) === 0) {
          // 3-byte
          output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
          output[offset++] = ((value >> 6) & 0x3f) | 0x80;
        } else {
          // 4-byte
          output[offset++] = ((value >> 18) & 0x07) | 0xf0;
          output[offset++] = ((value >> 12) & 0x3f) | 0x80;
          output[offset++] = ((value >> 6) & 0x3f) | 0x80;
        }
      }

      output[offset++] = (value & 0x3f) | 0x80;
    }

    return new Uint8Array(output);
  }`)
}

type t = {
  textEncoder: TextEncoder.t,
  extensions: Js.Dict.t<module(EncoderExtension)>,
}

let make = (~extensions) => {
  let textEncoder = TextEncoder.make()
  let extensions =
    extensions
    ->Js.Array2.map((ext: module(EncoderExtension)) => {
      let module(EncoderExtension) = ext
      (EncoderExtension.\"type"->Belt.Int.toString, ext)
    })
    ->Js.Dict.fromArray
  {
    textEncoder: textEncoder,
    extensions: extensions,
  }
}
