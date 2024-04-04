import { makeBaseDecoder } from '@urlpack/base-codec';

import { baseAlphabet } from './util.ts';

const defaultDecoder = makeBaseDecoder(baseAlphabet);
export const decode: (encoding: string) => Uint8Array = defaultDecoder.decode;
