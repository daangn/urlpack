import { decode as decodeBase58 } from '@urlpack/base58';
import { makeMessagePackDecoder } from '@urlpack/msgpack';

type DecoderOptions<Data> = {
  decodeString?: (str: string) => Uint8Array,
  decodeBinary?: (binary: Uint8Array) => Data,
};

export function makeDecoder<Data>(options: DecoderOptions<Data> = {}): {
  decode: (str: string) => Data,
} {
  const decodeString = decodeBase58;
  const decodeBinary = options.decodeBinary || makeMessagePackDecoder().decode;
  return {
    decode: str => decodeBinary(decodeString(str)) as Data,
  };
}
