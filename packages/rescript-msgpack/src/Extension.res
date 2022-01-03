module type EncoderExtension = {
  let \"type": int

  let check: Js.Types.obj_val => bool

  let encode: Js.Types.obj_val => Js.TypedArray2.Uint8Array.t
}

module type DecoderExtension = {
  let \"type": int

  let decode: (Js.TypedArray2.Uint8Array.t, int) => Message.t
}
