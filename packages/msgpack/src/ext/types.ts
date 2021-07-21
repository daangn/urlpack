export interface EncoderExtension<T extends object> {
  check(input: object): input is T;
  encode(input: T): Uint8Array;
}

export interface DecoderExtension<T extends object> {
  type: number;
  decode(binary: Uint8Array, length: number): [data: T, readBytes: number];
}
