import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { encode, decode } from '@urlpack/base62';

const textEncoder = new TextEncoder();

// https://tools.ietf.org/id/draft-msporny-base58-01.html
const cases: Array<[binary: Uint8Array, text: string]> = [
  [
    textEncoder.encode('Hello World!'),
    'T8dgcjRGkZ3aysdN',
  ],
  [
    textEncoder.encode(
      'The quick brown fox jumps over the lazy dog.',
    ),
    'XGPLPeg6g0VCuZCSfg8LKEZOBVFQ79VvzR8f2OlDiCg5SwBJDmeq6nysKtS',
  ],
  [
    new Uint8Array([0x00, 0x00, 0x28, 0x7f, 0xb4, 0xcd]),
    '00jyw3x',
  ],
];

for (const [binary, text] of cases) {
  test('base62.encode', () => {
    assert.equal(encode(binary), text);
  });

  test('base62.decode', () => {
    assert.equal(decode(text), binary);
  });
}

test.run();
