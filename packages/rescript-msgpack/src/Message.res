type t

external make: 'a => t = "%identity"

@val external makeArray: int => array<t> = "Array"

external toString: t => string = "%identity"

external toInt: t => int = "%identity"

external toFloat: t => float = "%identity"

external toJSON: t => Js.Json.t = "%identity"
