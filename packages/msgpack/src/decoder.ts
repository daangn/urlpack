import type { Input } from './types';
import type { DecoderExtension } from './ext/types';

// @ts-ignore
import { make as makeDecoder, decode } from './decoder.bs';

type DecodeFn<ExtensionType extends object> = (dataArray: Uint8Array) => Input<ExtensionType>;

type DecoderOptions<ExtensionType extends object> = {
  decoderExtensions?: Array<DecoderExtension<ExtensionType>>,
};

export function makeMessagePackDecoder<ExtensionType extends object = object>({
  decoderExtensions = [],
}: DecoderOptions<ExtensionType> = {}): {
  decode: DecodeFn<ExtensionType>,
} {
  let decoder = makeDecoder(decoderExtensions);
  return {
    decode: input => decode(decoder, input),
  };
}
