export interface EncoderExtension<T extends object> {
  type: number;
  check(input: object): input is T;
  encode(input: T): Uint8Array;
}

export interface DecoderExtension<T extends object> {
  type: number;
  decode(dataArray: Uint8Array, byteLength: number): T;
}
