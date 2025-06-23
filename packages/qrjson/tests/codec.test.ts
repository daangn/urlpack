import { test } from 'node:test';
import * as assert from 'node:assert/strict';

import { makeQrJsonEncoder, makeQrJsonDecoder } from '@urlpack/qrjson';

test('pack json', () => {
  const data = {
    href: 'http://daangn.com',
    uid: 1234567,
    context: {
      foo: 'bar',
      baz: [1, 2, 3, 4, 5],
    },
  };

  const { encode } = makeQrJsonEncoder<typeof data>();
  const { decode } = makeQrJsonDecoder<typeof data>();

  const stored = encode(data);
  console.log(stored);

  assert.deepEqual(decode(stored), data);
});

test.run();
