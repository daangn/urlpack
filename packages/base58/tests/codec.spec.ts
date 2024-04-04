import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { encode, decode } from '@urlpack/base58';

const textEncoder = new TextEncoder();

// https://tools.ietf.org/id/draft-msporny-base58-01.html
const cases: Array<[binary: Uint8Array, text: string]> = [
  [
    textEncoder.encode('Hello World!'),
    '2NEpo7TZRRrLZSi2U',
  ],
  [
    textEncoder.encode(
      'The quick brown fox jumps over the lazy dog.',
    ),
    'USm3fpXnKG5EUBx2ndxBDMPVciP5hGey2Jh4NDv6gmeo1LkMeiKrLJUUBk6Z'
    ,
  ],
  [
    new Uint8Array([0x00, 0x00, 0x28, 0x7f, 0xb4, 0xcd]),
    '11233QC4',
  ],
];

for (const [binary, text] of cases) {
  test('base58.encode', () => {
    assert.equal(encode(binary), text);
  });

  test('base58.decode', () => {
    assert.equal(decode(text), binary);
  });
}

test.run();
