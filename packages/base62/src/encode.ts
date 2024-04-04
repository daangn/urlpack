import { makeBaseEncoder } from '@urlpack/base-codec';

import { baseAlphabet } from './util.ts';

const defaultEncoder = makeBaseEncoder(baseAlphabet);
export const encode: (binary: Uint8Array) => string = defaultEncoder.encode;
