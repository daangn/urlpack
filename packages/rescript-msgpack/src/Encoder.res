open Extension

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
