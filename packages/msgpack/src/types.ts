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

export interface EncoderExtension<T extends object> {
  type: number;
  check(input: object): input is T;
  encode(input: T): Uint8Array;
}

export interface DecoderExtension<T extends object> {
  type: number;
  decode(dataArray: Uint8Array, length: number): T;
}
