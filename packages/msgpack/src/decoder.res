open Js
open TypedArray2

module TextDecoder = {
  type t

  @new external make: unit => t = "TextDecoder"
  @send external decode: (t, Uint8Array.t) => string = "decode"

  /**
   * Borrowing from https://github.com/msgpack/msgpack-javascript/blob/c58b7e2/src/utils/utf8.ts#L48-L89
   *
   * Note:
   *   The Node.js builtin TextDecoder is seriously slow.
   *   This custom decoder is 10~12x faster than the builtin
   *
   * See benchmarks/utf8-decode.js
   */
  let decode2: (t, Uint8Array.t) => string = %raw(`function (_t, bytes) {
    let offset = 0;
    const end = bytes.length;

    const units = [];
    let result = "";
    while (offset < end) {
      const byte1 = bytes[offset++];
      if ((byte1 & 0x80) === 0) {
        // 1 byte
        units.push(byte1);
      } else if ((byte1 & 0xe0) === 0xc0) {
        // 2 bytes
        const byte2 = bytes[offset++] & 0x3f;
        units.push(((byte1 & 0x1f) << 6) | byte2);
      } else if ((byte1 & 0xf0) === 0xe0) {
        // 3 bytes
        const byte2 = bytes[offset++] & 0x3f;
        const byte3 = bytes[offset++] & 0x3f;
        units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
      } else if ((byte1 & 0xf8) === 0xf0) {
        // 4 bytes
        const byte2 = bytes[offset++] & 0x3f;
        const byte3 = bytes[offset++] & 0x3f;
        const byte4 = bytes[offset++] & 0x3f;
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
}

type result
external result: 'a => result = "%identity"
external toString: result => string = "%identity"

@new external makeSizedArray: int => array<result> = "Array"

let flip64: Uint8Array.t => unit = %raw(`function(binary) {
  let carry = 1;
  for (let i = 7; i >= 0; i--) {
    const v = (binary[i] ^ 0xff) + carry;
    binary[i] = v & 0xff;
    carry = v >> 8;
  }
}`)

type ext = {
  \"type": int,
  decode: (. Uint8Array.t, int) => result,
}

@module("./ext/TimestampDecoder") external timestampExt: ext = "timestamDecoder"

type t = {
  textDecoder: TextDecoder.t,
  extensions: Dict.t<ext>,
}

let make = (~extensions) => {
  let textDecoder = TextDecoder.make()
  let extensions = extensions->Js.Dict.fromArray
  {
    textDecoder: textDecoder,
    extensions: extensions,
  }
}

type state =
  | ExpectHeader
  | DecodeString(int)
  | DecodeArray(int, array<result>)
  | DecodeMap(int, Dict.t<result>)
  | DecodeBinary(int)
  | DecodeExt(int, ext)
  | Done(result)

let decode = (t, binary) => {
  let {textDecoder, extensions} = t
  let binary = binary->Uint8Array.copy
  let view = binary->Uint8Array.buffer->DataView.fromBuffer
  let rec decode = (binary, ~state, ~cursor) => {
    switch state {
    | ExpectHeader => {
        let header = view->DataView.getUint8(cursor)
        let cursor = cursor + 1
        switch header {
        | header if header < 0x80 => binary->decode(~state=Done(header->result), ~cursor)
        | header if header < 0x90 => {
            let len = header->land(0xf)
            binary->decode(~state=DecodeMap(len, Dict.empty()), ~cursor)
          }
        | header if header < 0xa0 => {
            let len = header->land(0xf)
            binary->decode(~state=DecodeArray(len, makeSizedArray(len)), ~cursor)
          }
        | header if header < 0xc0 => {
            let len = header->land(0x1f)
            binary->decode(~state=DecodeString(len), ~cursor)
          }
        | 0xc0 => binary->decode(~state=Done(null->result), ~cursor)
        | 0xc2 => binary->decode(~state=Done(false->result), ~cursor)
        | 0xc3 => binary->decode(~state=Done(true->result), ~cursor)
        | 0xc4 => {
            let len = view->DataView.getUint8(cursor)
            binary->decode(~state=DecodeBinary(len), ~cursor=cursor + 1)
          }
        | 0xc5 => {
            let len = view->DataView.getUint16(cursor)
            binary->decode(~state=DecodeBinary(len), ~cursor=cursor + 2)
          }
        | 0xc6 => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeBinary(len), ~cursor=cursor + 4)
          }
        | 0xc7 => {
            let len = view->DataView.getUint8(cursor)
            let type_ = view->DataView.getInt8(cursor + 1)
            if type_ == timestampExt.\"type" {
              binary->decode(~state=DecodeExt(len, timestampExt), ~cursor=cursor + 2)
            } else {
              switch extensions->Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 2)
              | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xc8 => {
            let len = view->DataView.getUint16(cursor)
            let type_ = view->DataView.getInt8(cursor + 2)
            switch extensions->Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 2)
            | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xc9 => {
            let len = view->DataView.getUint32(cursor)
            let type_ = view->DataView.getInt8(cursor + 4)
            switch extensions->Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 4)
            | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xca => {
            let num = view->DataView.getFloat32(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 4)
          }
        | 0xcb => {
            let num = view->DataView.getFloat64(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 8)
          }
        | 0xcc => {
            let num = view->DataView.getUint8(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 1)
          }
        | 0xcd => {
            let num = view->DataView.getUint16(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 2)
          }
        | 0xce => {
            let num = view->DataView.getUint32(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 4)
          }
        | 0xcf => {
            let hi = view->DataView.getUint32(cursor)->Belt.Int.toFloat
            let lo = view->DataView.getUint32(cursor + 4)->Belt.Int.toFloat
            let num = hi *. Math.pow_float(~base=256.0, ~exp=4.0) +. lo
            binary->decode(~state=Done(num->result), ~cursor=cursor + 8)
          }
        | 0xd0 => {
            let num = view->DataView.getInt8(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 1)
          }
        | 0xd1 => {
            let num = view->DataView.getInt16(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 2)
          }
        | 0xd2 => {
            let num = view->DataView.getInt32(cursor)
            binary->decode(~state=Done(num->result), ~cursor=cursor + 4)
          }
        | 0xd3 => {
            binary->Uint8Array.subarray(~start=cursor, ~end_=cursor + 9)->flip64
            let hi = view->DataView.getUint32(cursor)->Belt.Int.toFloat
            let lo = view->DataView.getUint32(cursor + 4)->Belt.Int.toFloat
            let num = hi *. Math.pow_float(~base=256.0, ~exp=4.0) +. lo
            binary->decode(~state=Done((0.0 -. num)->result), ~cursor=cursor + 8)
          }
        | 0xd4 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(1, ext), ~cursor=cursor + 1)
            | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xd5 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(2, ext), ~cursor=cursor + 1)
            | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xd6 => {
            let type_ = view->DataView.getInt8(cursor)
            if type_ == timestampExt.\"type" {
              binary->decode(~state=DecodeExt(4, timestampExt), ~cursor=cursor + 1)
            } else {
              switch extensions->Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(4, ext), ~cursor=cursor + 1)
              | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xd7 => {
            let type_ = view->DataView.getInt8(cursor)
            if type_ == timestampExt.\"type" {
              binary->decode(~state=DecodeExt(8, timestampExt), ~cursor=cursor + 1)
            } else {
              switch extensions->Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(8, ext), ~cursor=cursor + 1)
              | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xd8 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(16, ext), ~cursor=cursor + 1)
            | None => Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xd9 => {
            let len = view->DataView.getUint8(cursor)
            binary->decode(~state=DecodeString(len), ~cursor=cursor + 1)
          }
        | 0xda => {
            let len = view->DataView.getUint16(cursor)
            binary->decode(~state=DecodeString(len), ~cursor=cursor + 2)
          }
        | 0xdb => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeString(len), ~cursor=cursor + 4)
          }
        | 0xdc => {
            let len = view->DataView.getUint16(cursor)
            binary->decode(~state=DecodeArray(len, makeSizedArray(len)), ~cursor=cursor + 2)
          }
        | 0xdd => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeArray(len, makeSizedArray(len)), ~cursor=cursor + 4)
          }
        | 0xde => {
            let len = view->DataView.getUint16(cursor)
            binary->decode(~state=DecodeMap(len, Dict.empty()), ~cursor=cursor + 2)
          }
        | 0xdf => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeMap(len, Dict.empty()), ~cursor=cursor + 4)
          }
        | header if header < 0x100 => {
            let num = header->lxor(255)->lnot
            binary->decode(~state=Done(num->result), ~cursor)
          }
        | header => Exn.raiseError(`Unknown header ${header->Belt.Int.toString}`)
        }
      }
    | DecodeString(len) => {
        let view = binary->Uint8Array.subarray(~start=cursor, ~end_=cursor + len)
        let text = textDecoder->TextDecoder.decode2(view)
        binary->decode(~state=Done(text->result), ~cursor=cursor + len)
      }
    | DecodeArray(len, array) =>
      switch len {
      | 0 => binary->decode(~state=Done(array->result), ~cursor)
      | len => {
          let (item, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
          let index = array->Array2.length - len
          array->Array2.unsafe_set(index, item)
          binary->decode(~state=DecodeArray(len - 1, array), ~cursor)
        }
      }
    | DecodeMap(len, map) =>
      switch len {
      | 0 => binary->decode(~state=Done(map->result), ~cursor)
      | len => {
          let (key, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
          if typeof(key) == "string" {
            let (value, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
            map->Dict.set(key->toString, value)
            binary->decode(~state=DecodeMap(len - 1, map), ~cursor)
          } else {
            Exn.raiseError(`Unexpected key type. Expected string, but got ${typeof(key)}`)
          }
        }
      }
    | DecodeBinary(len) => {
        let copy = binary->Uint8Array.slice(~start=cursor, ~end_=cursor + len)
        binary->decode(~state=Done(copy->result), ~cursor=cursor + len)
      }
    | DecodeExt(len, ext) => {
        let copy = binary->Uint8Array.slice(~start=cursor, ~end_=cursor + len)
        binary->decode(~state=Done(ext.decode(. copy, len)), ~cursor=cursor + len)
      }
    | Done(result) => (result, cursor)
    }
  }

  let (result, readLength) = binary->decode(~state=ExpectHeader, ~cursor=0)

  let inputLength = binary->Uint8Array.length
  if inputLength != readLength {
    Exn.raiseError(
      `Invalid input length, expected ${inputLength->Belt.Int.toString}, but got ${readLength->Belt.Int.toString}`,
    )
  }

  result
}
