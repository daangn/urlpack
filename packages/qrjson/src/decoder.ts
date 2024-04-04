import { decode as decodeBase10 } from '@urlpack/base10';
import { makeMessagePackDecoder } from '@urlpack/msgpack';

export function makeQrJsonDecoder<Data>(): {
  decode: (str: string) => Data,
} {
  const decodeString = decodeBase10;
  const decodeBinary = makeMessagePackDecoder().decode;
  return {
    decode: str => decodeBinary(decodeString(str)) as Data,
  };
}
