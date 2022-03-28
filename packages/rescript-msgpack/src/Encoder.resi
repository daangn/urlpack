type t = {
  textEncoder: TextEncoder.t,
  extensions: Js.Dict.t<module(Extension.EncoderExtension)>,
}

let make: (~extensions: array<module(Extension.EncoderExtension)>=?, unit) => t

let encode: (t, Message.t) => Js.TypedArray2.Uint8Array.t
