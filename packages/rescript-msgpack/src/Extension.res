module type EncoderExtension = {
  let \"type": int

  let check: (Js.Json.t) => bool

  let encode: (Js.Json.t) => Js.TypedArray2.Uint8Array.t
}

module type DecoderExtension = {
  let \"type": int

  let decode: (Js.TypedArray2.Uint8Array.t, int) => Result.t
}
