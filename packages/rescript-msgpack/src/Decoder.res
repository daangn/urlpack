open Js.TypedArray2
open Extension

type t = {
  textDecoder: TextDecoder.t,
  extensions: Js.Dict.t<module(DecoderExtension)>,
}

let make = (~extensions) => {
  let textDecoder = TextDecoder.make()
  let extensions =
    extensions
    ->Js.Array2.map((ext: module(DecoderExtension)) => {
      let module(DecoderExtension) = ext
      (DecoderExtension.\"type"->Belt.Int.toString, ext)
    })
    ->Js.Dict.fromArray
  {
    textDecoder: textDecoder,
    extensions: extensions,
  }
}

let flip64: Uint8Array.t => unit = %raw(`binary => {
  let carry = 1;
  for (let i = 7; i >= 0; i--) {
    let v = (binary[i] ^ 0xff) + carry;
    binary[i] = v & 0xff;
    carry = v >> 8;
  }
}`)

type state =
  | ExpectHeader
  | DecodeString(int)
  | DecodeArray(int, array<Result.t>)
  | DecodeMap(int, Js.Dict.t<Result.t>)
  | DecodeBinary(int)
  | DecodeExt(int, module(DecoderExtension))
  | Done(Result.t)

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
        | header if header < 0x80 => binary->decode(~state=Done(header->Result.make), ~cursor)
        | header if header < 0x90 => {
            let len = header->land(0xf)
            binary->decode(~state=DecodeMap(len, Js.Dict.empty()), ~cursor)
          }
        | header if header < 0xa0 => {
            let len = header->land(0xf)
            binary->decode(~state=DecodeArray(len, Result.makeArray(len)), ~cursor)
          }
        | header if header < 0xc0 => {
            let len = header->land(0x1f)
            binary->decode(~state=DecodeString(len), ~cursor)
          }
        | 0xc0 => binary->decode(~state=Done(Js.null->Result.make), ~cursor)
        | 0xc2 => binary->decode(~state=Done(false->Result.make), ~cursor)
        | 0xc3 => binary->decode(~state=Done(true->Result.make), ~cursor)
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
            if type_ == TimestampDecoder.\"type" {
              binary->decode(~state=DecodeExt(len, module(TimestampDecoder)), ~cursor=cursor + 2)
            } else {
              switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 2)
              | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xc8 => {
            let len = view->DataView.getUint16(cursor)
            let type_ = view->DataView.getInt8(cursor + 2)
            if type_ == TimestampDecoder.\"type" {
              binary->decode(~state=DecodeExt(len, module(TimestampDecoder)), ~cursor=cursor + 2)
            } else {
              switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 2)
              | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xc9 => {
            let len = view->DataView.getUint32(cursor)
            let type_ = view->DataView.getInt8(cursor + 4)
            if type_ == TimestampDecoder.\"type" {
              binary->decode(~state=DecodeExt(len, module(TimestampDecoder)), ~cursor=cursor + 4)
            } else {
              switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(len, ext), ~cursor=cursor + 4)
              | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xca => {
            let num = view->DataView.getFloat32(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 4)
          }
        | 0xcb => {
            let num = view->DataView.getFloat64(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 8)
          }
        | 0xcc => {
            let num = view->DataView.getUint8(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 1)
          }
        | 0xcd => {
            let num = view->DataView.getUint16(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 2)
          }
        | 0xce => {
            let num = view->DataView.getUint32(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 4)
          }
        | 0xcf => {
            let hi = view->DataView.getUint32(cursor)->Belt.Int.toFloat
            let lo = view->DataView.getUint32(cursor + 4)->Belt.Int.toFloat
            let num = hi *. Js.Math.pow_float(~base=256.0, ~exp=4.0) +. lo
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 8)
          }
        | 0xd0 => {
            let num = view->DataView.getInt8(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 1)
          }
        | 0xd1 => {
            let num = view->DataView.getInt16(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 2)
          }
        | 0xd2 => {
            let num = view->DataView.getInt32(cursor)
            binary->decode(~state=Done(num->Result.make), ~cursor=cursor + 4)
          }
        | 0xd3 => {
            binary->Uint8Array.subarray(~start=cursor, ~end_=cursor + 9)->flip64
            let hi = view->DataView.getUint32(cursor)->Belt.Int.toFloat
            let lo = view->DataView.getUint32(cursor + 4)->Belt.Int.toFloat
            let num = hi *. Js.Math.pow_float(~base=256.0, ~exp=4.0) +. lo
            binary->decode(~state=Done((0.0 -. num)->Result.make), ~cursor=cursor + 8)
          }
        | 0xd4 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(1, ext), ~cursor=cursor + 1)
            | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xd5 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(2, ext), ~cursor=cursor + 1)
            | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
            }
          }
        | 0xd6 => {
            let type_ = view->DataView.getInt8(cursor)
            if type_ == TimestampDecoder.\"type" {
              binary->decode(~state=DecodeExt(4, module(TimestampDecoder)), ~cursor=cursor + 1)
            } else {
              switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(4, ext), ~cursor=cursor + 1)
              | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xd7 => {
            let type_ = view->DataView.getInt8(cursor)
            if type_ == TimestampDecoder.\"type" {
              binary->decode(~state=DecodeExt(8, module(TimestampDecoder)), ~cursor=cursor + 1)
            } else {
              switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
              | Some(ext) => binary->decode(~state=DecodeExt(8, ext), ~cursor=cursor + 1)
              | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
              }
            }
          }
        | 0xd8 => {
            let type_ = view->DataView.getInt8(cursor)
            switch extensions->Js.Dict.get(type_->Belt.Int.toString) {
            | Some(ext) => binary->decode(~state=DecodeExt(16, ext), ~cursor=cursor + 1)
            | None => Js.Exn.raiseError(`Unknown extension type ${type_->Belt.Int.toString}`)
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
            binary->decode(~state=DecodeArray(len, Result.makeArray(len)), ~cursor=cursor + 2)
          }
        | 0xdd => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeArray(len, Result.makeArray(len)), ~cursor=cursor + 4)
          }
        | 0xde => {
            let len = view->DataView.getUint16(cursor)
            binary->decode(~state=DecodeMap(len, Js.Dict.empty()), ~cursor=cursor + 2)
          }
        | 0xdf => {
            let len = view->DataView.getUint32(cursor)
            binary->decode(~state=DecodeMap(len, Js.Dict.empty()), ~cursor=cursor + 4)
          }
        | header if header < 0x100 => {
            let num = header->lxor(255)->lnot
            binary->decode(~state=Done(num->Result.make), ~cursor)
          }
        | header => Js.Exn.raiseError(`Unknown header ${header->Belt.Int.toString}`)
        }
      }
    | DecodeString(len) => {
        let view = binary->Uint8Array.subarray(~start=cursor, ~end_=cursor + len)
        let text = textDecoder->TextDecoder.decode2(view)
        binary->decode(~state=Done(text->Result.make), ~cursor=cursor + len)
      }
    | DecodeArray(len, array) =>
      switch len {
      | 0 => binary->decode(~state=Done(array->Result.make), ~cursor)
      | len => {
          let (item, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
          let index = array->Js.Array2.length - len
          array->Js.Array2.unsafe_set(index, item)
          binary->decode(~state=DecodeArray(len - 1, array), ~cursor)
        }
      }
    | DecodeMap(len, map) =>
      switch len {
      | 0 => binary->decode(~state=Done(map->Result.make), ~cursor)
      | len => {
          let (key, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
          if Js.typeof(key) == "string" {
            let (value, cursor) = binary->decode(~state=ExpectHeader, ~cursor)
            map->Js.Dict.set(key->Result.toString, value)
            binary->decode(~state=DecodeMap(len - 1, map), ~cursor)
          } else {
            Js.Exn.raiseError(`Unexpected key type. Expected string, but got ${Js.typeof(key)}`)
          }
        }
      }
    | DecodeBinary(len) => {
        let copy = binary->Uint8Array.slice(~start=cursor, ~end_=cursor + len)
        binary->decode(~state=Done(copy->Result.make), ~cursor=cursor + len)
      }
    | DecodeExt(len, module(DecoderExtension)) => {
        let copy = binary->Uint8Array.slice(~start=cursor, ~end_=cursor + len)
        binary->decode(~state=Done(DecoderExtension.decode(copy, len)), ~cursor=cursor + len)
      }
    | Done(result) => (result, cursor)
    }
  }

  let (result, readLength) = binary->decode(~state=ExpectHeader, ~cursor=0)

  let inputLength = binary->Uint8Array.length
  if inputLength != readLength {
    Js.Exn.raiseError(
      `Invalid input length, expected ${inputLength->Belt.Int.toString}, but got ${readLength->Belt.Int.toString}`,
    )
  }

  result->Result.toJSON
}
