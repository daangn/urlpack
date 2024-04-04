import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { encode, decode } from '@urlpack/base10';

const textEncoder = new TextEncoder();

const cases: Array<[binary: Uint8Array, text: string]> = [
  [
    textEncoder.encode('안녕하세요!'),
    '314474236304828881015048610782331442209',
  ],
  [
    textEncoder.encode(
      'The quick brown fox jumps over the lazy dog.',
    ),
    '3024830571690175283291907639196436031967763819210983988162282536502237781693262640684650930677706176554798',
  ],
  [
    new Uint8Array([0x00, 0x00, 0x28, 0x7f, 0xb4, 0xcd]),
    '00679457997',
  ],
];

for (const [binary, text] of cases) {
  test('base10.encode', () => {
    assert.equal(encode(binary), text);
  });

  test('base10.decode', () => {
    assert.equal(decode(text), binary);
  });
}

test.run();
