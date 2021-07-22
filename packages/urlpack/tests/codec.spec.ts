import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { makeEncoder, makeDecoder } from '../src';

test('urlpack', () => {
  const data = {
    href: 'http://daangn.com',
    uid: 1234567,
    context: {
      foo: 'bar',
      baz: [1, 2, 3, 4, 5],
    },
  };

  const { encode } = makeEncoder<typeof data>();
  const { decode } = makeDecoder<typeof data>();

  const stored = encode(data);
  console.log(stored);

  assert.equal(decode(stored), data);
});

test.run();
