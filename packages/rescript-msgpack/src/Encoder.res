open Extension

type t = {
  textEncoder: TextEncoder.t,
  extensions: Js.Dict.t<module(EncoderExtension)>,
}

let make = (~extensions=[], ()) => {
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

module Obj = {
  type t = Js.Types.obj_val

  @scope("Array") @val external isArray: t => bool = "isArray"

  external toArray: t => array<'a> = "%identity"

  external toArrayBuffer: t => Js.TypedArray2.ArrayBuffer.t = "%identity"

  external toUint8Array: t => Js.TypedArray2.Uint8Array.t = "%identity"

  external toDict: t => Js.Dict.t<'a> = "%identity"
}

module Uint8Array = {
  include Js.TypedArray2.Uint8Array

  external toArrayLike: t => array<elt> = "%identity"

  @inline
  let setOffset = (t, offset, elt) => {
    t->unsafe_set(offset, elt)
    t
  }

  @inline
  let setOffsetA = (t, offset, arr) => {
    t->setArrayOffset(arr->toArrayLike, offset)
    t
  }
}

type state =
  | ExpectValue
  | EncodeInt(int)
  | EncodeFloat(float)
  | EncodeString(string)
  | EncodeBinary(Uint8Array.t)
  | EncodeArray(int, array<Message.t>)
  | EncodeMap(int, array<(string, Message.t)>)
  | Done(Uint8Array.t)

let encode = (t, msg) => {
  let {textEncoder, extensions} = t

  let rec encode = (msg, ~state) => {
    open Uint8Array

    switch state {
    | ExpectValue =>
      switch msg->Message.toJSON->Js.Types.classify {
      | JSNull => msg->encode(~state=Done(make([0xc0])))
      | JSFalse => msg->encode(~state=Done(make([0xc2])))
      | JSTrue => msg->encode(~state=Done(make([0xc3])))
      | JSNumber(number) if %raw(`number % 1 > 0`) => msg->encode(~state=EncodeFloat(number))
      | JSNumber(number) if -2147483648.0 <= number && number <= 2147483647.0 =>
        msg->encode(~state=EncodeInt(number->Belt.Float.toInt))
      | JSNumber(_) => Js.Exn.raiseError(`Only support int32 range yet`)
      | JSString(string) => msg->encode(~state=EncodeString(string))
      | JSObject(object) if object->Obj.isArray => {
          let array = object->Obj.toArray
          let len = array->Belt.Array.length
          msg->encode(~state=EncodeArray(len, array))
        }
      | JSObject(object) if %raw(`object instanceof Uint8Array`) => {
          let binary = object->Obj.toUint8Array
          msg->encode(~state=EncodeBinary(binary))
        }
      | JSObject(object) if %raw(`object instanceof ArrayBuffer`) => {
          let binary = object->Obj.toArrayBuffer->Uint8Array.fromBuffer
          msg->encode(~state=EncodeBinary(binary))
        }
      | JSObject(object) if object->TimestampEncoder.check => msg->encode(
          ~state=Done(object->TimestampEncoder.encode),
        )
      | JSObject(object) =>
        switch extensions->Js.Dict.get(TimestampEncoder.\"type"->Belt.Int.toString) {
        | Some(module(EncoderExtension)) =>
          msg->encode(~state=Done(object->EncoderExtension.encode))
        | None => {
            let entries = object->Obj.toDict->Js.Dict.entries
            let len = entries->Belt.Array.length
            msg->encode(~state=EncodeMap(len, entries))
          }
        }
      | _ => msg->encode(~state=Done(fromLength(0)))
      }
    | EncodeInt(value) if value == 0 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if 0 < value && value < 128 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if 128 <= value && value < 256 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if 256 <= value && value < 65536 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if 65536 <= value => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if 0 > value && value >= -32 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if -32 > value && value >= -128 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if -128 > value && value >= -32768 => msg->encode(~state=Done(make([0])))
    | EncodeInt(value) if -32768 > value => msg->encode(~state=Done(make([0])))
    | EncodeFloat(value) => {
        open Js.TypedArray2
        let is64 = value->Js.Math.fround != value
        let array = fromLength(is64 ? 9 : 5)
        let view = DataView.fromBuffer(array->buffer)
        if is64 {
          array->unsafe_set(0, 0xcb)
          view->DataView.setFloat64(1, value)
        } else {
          array->unsafe_set(0, 0xca)
          view->DataView.setFloat32(1, value)
        }
        msg->encode(~state=Done(array))
      }
    | EncodeString(value) => {
        let buffer = textEncoder->TextEncoder.encode2(value)
        let len = buffer->length
        let binary = switch len {
        | len if len < 32 =>
          fromLength(len + 1)->setOffset(0, len->lor(0xa0))->setOffsetA(1, buffer)
        | len if len < 256 =>
          fromLength(len + 2)->setOffset(0, 0xd9)->setOffset(1, len)->setOffsetA(2, buffer)
        | len if len < 65536 =>
          fromLength(len + 3)
          ->setOffset(0, 0xda)
          ->setOffset(1, len->lsr(8)->land(0xff))
          ->setOffset(2, len->land(0xff))
          ->setOffsetA(3, buffer)
        | len if Belt.Int.toFloat(len) < 4294967296.0 =>
          fromLength(len + 5)
          ->setOffset(0, 0xdb)
          ->setOffset(1, len->lsr(24)->land(0xff))
          ->setOffset(2, len->lsr(16)->land(0xff))
          ->setOffset(3, len->lsr(8)->land(0xff))
          ->setOffset(4, len->land(0xff))
          ->setOffsetA(5, buffer)
        | _ => fromLength(0)
        }
        msg->encode(~state=Done(binary))
      }
    | EncodeBinary(value) => {
        let len = value->Uint8Array.length
        let binary = switch len {
        | len if len < 256 =>
          fromLength(len + 2)->setOffset(0, 0xc4)->setOffset(1, len)->setOffsetA(2, value)
        | len if len < 65536 =>
          fromLength(len + 3)
          ->setOffset(0, 0xc5)
          ->setOffset(1, len->lsr(8))
          ->setOffset(2, len->land(0xff))
          ->setOffsetA(3, value)
        | len if len->Belt.Int.toFloat < 4294967296.0 =>
          fromLength(len + 5)
          ->setOffset(0, 0xc6)
          ->setOffset(1, len->lsr(24)->land(0xff))
          ->setOffset(2, len->lsr(16)->land(0xff))
          ->setOffset(3, len->lsr(8)->land(0xff))
          ->setOffset(4, len->land(0xff))
          ->setOffsetA(5, value)
        | _ => fromLength(0)
        }
        msg->encode(~state=Done(binary))
      }
    | Done(binary) => binary
    }
  }

  msg->encode(~state=ExpectValue)
}
