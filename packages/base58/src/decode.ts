import { makeDecoder } from '@urlpack/base-vary';

import { baseAlphabet } from './util';

const defaultDecoder = makeDecoder(baseAlphabet);
export const decode: (encoding: string) => Uint8Array = defaultDecoder.decode;
