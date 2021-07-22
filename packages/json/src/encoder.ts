import { encode as encodeToBase58 } from '@urlpack/base58';
import { makeMessagePackEncoder } from '@urlpack/msgpack';

type JsonEncoderOptions<Data> = {
  encodeData?: (data: Data) => Uint8Array,
  encodeBinary?: (binary: Uint8Array) => string,
};

export function makeJsonEncoder<Data>(options: JsonEncoderOptions<Data> = {}): {
  encode: (data: Data) => string,
} {
  const encodeData = options.encodeData || makeMessagePackEncoder().encode;
  const encodeBinary = options.encodeBinary || encodeToBase58;
  return {
    encode: data => encodeBinary(encodeData(data as any)),
  };
}
