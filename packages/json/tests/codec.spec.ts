import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { makeBaseEncoder, makeBaseDecoder } from '@urlpack/base-codec';
import { makeJsonEncoder, makeJsonDecoder } from '../src';

test('pack json with default (msgpack, base58)', () => {
  const data = {
    href: 'http://daangn.com',
    uid: 1234567,
    context: {
      foo: 'bar',
      baz: [1, 2, 3, 4, 5],
    },
  };

  const { encode } = makeJsonEncoder<typeof data>();
  const { decode } = makeJsonDecoder<typeof data>();

  const stored = encode(data);
  console.log(stored);

  assert.equal(decode(stored), data);
});

test('pack json with custom (msgpack, base34)', () => {
  const data = {
    href: 'http://daangn.com',
    uid: 1234567,
    context: {
      foo: 'bar',
      baz: [1, 2, 3, 4, 5],
    },
  };

  const alphabet = '123456789abcdefghijkmnopqrstuvwxyz';
  const baseEncoder = makeBaseEncoder(alphabet);
  const baseDecoder = makeBaseDecoder(alphabet);
  const { encode } = makeJsonEncoder<typeof data>({ encodeBinary: baseEncoder.encode });
  const { decode } = makeJsonDecoder<typeof data>({ decodeString: baseDecoder.decode });

  const stored = encode(data);
  console.log(stored);

  assert.equal(decode(stored), data);
});

test.run();
