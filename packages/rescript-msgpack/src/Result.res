type t

external make: 'a => t = "%identity"

@val external makeArray: int => array<t> = "Array"

external toString: t => string = "%identity"

external emit: t => {..} = "%identity"
