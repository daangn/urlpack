import { encode as encodeToBase10 } from '@urlpack/base10';
import { makeMessagePackEncoder } from '@urlpack/msgpack';

export function makeQrJsonEncoder<Data>(): {
  encode: (data: Data) => string,
} {
  const encodeData = makeMessagePackEncoder().encode;
  const encodeBinary = encodeToBase10;
  return {
    encode: data => encodeBinary(encodeData(data as any)),
  };
}
