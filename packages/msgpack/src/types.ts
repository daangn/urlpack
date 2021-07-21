export type Input = null | undefined | number | boolean | string | Uint8Array | Array<Input> | {
  [key: string]: Input,
};
