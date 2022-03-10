import { decode as decodeBase58 } from '@urlpack/base58';
import { makeMessagePackDecoder } from '@urlpack/msgpack';

type JsonDecoderOptions<Data> = {
  decodeString?: (str: string) => Uint8Array,
  decodeBinary?: (binary: Uint8Array) => Data,
};

export function makeJsonDecoder<Data>(options: JsonDecoderOptions<Data> = {}): {
  decode: (str: string) => Data,
} {
  const decodeString = options.decodeString || decodeBase58;
  const decodeBinary = options.decodeBinary || makeMessagePackDecoder().decode;
  return {
    decode: str => decodeBinary(decodeString(str)) as Data,
  };
}
