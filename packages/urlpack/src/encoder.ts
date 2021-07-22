import { encode as encodeToBase58 } from '@urlpack/base58';
import { makeMessagePackEncoder } from '@urlpack/msgpack';

type EncoderOptions<Data> = {
  encodeData?: (data: Data) => Uint8Array,
  encodeBinary?: (binary: Uint8Array) => string,
};

export function makeEncoder<Data>(options: EncoderOptions<Data> = {}): {
  encode: (data: Data) => string,
} {
  const encodeData = options.encodeData || makeMessagePackEncoder().encode;
  const encodeBinary = options.encodeBinary || encodeToBase58;
  return {
    encode: data => encodeBinary(encodeData(data as any)),
  };
}
