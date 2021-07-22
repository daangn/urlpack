export type Input<ExtensionType extends object> = (
  | null
  | undefined
  | number
  | bigint
  | boolean
  | string
  | Uint8Array
  | Array<Input<ExtensionType>>
  | { [key: string]: Input<ExtensionType> }
  | Date
  | ExtensionType
);
