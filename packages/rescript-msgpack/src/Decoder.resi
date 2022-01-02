type t = {
  textDecoder: TextDecoder.t,
  extensions: Js.Dict.t<module(Extension.DecoderExtension)>,
}

let make: (~extensions: array<module(Extension.DecoderExtension)>=?, unit) => t

let decode: (t, Js.TypedArray2.Uint8Array.t) => {..}
