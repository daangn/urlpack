import { makeEncoder } from '@urlpack/base-vary';

import { baseAlphabet } from './util';

const defaultEncoder = makeEncoder(baseAlphabet);
export const encode: (binary: Uint8Array) => string = defaultEncoder.encode;
