import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { makeJsonEncoder, makeJsonDecoder } from '../src';

test('urlpack', () => {
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

test.run();
