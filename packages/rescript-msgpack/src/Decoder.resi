module TextDecoder: {
  type t

  let make: unit => t

  @send external decode: (t, Js.TypedArray2.Uint8Array.t) => string = "decode"
  let decode2: (t, Js.TypedArray2.Uint8Array.t) => string
}

type t = {
  textDecoder: TextDecoder.t,
  extensions: Js.Dict.t<module(Extension.DecoderExtension)>,
}

let make: (~extensions: array<module(Extension.DecoderExtension)>) => t

let decode: (t, Js.TypedArray2.Uint8Array.t) => Js.Json.t
