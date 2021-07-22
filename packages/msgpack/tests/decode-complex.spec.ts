import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { makeMessagePackDecoder } from '../src';

const { decode } = makeMessagePackDecoder();

const complex = new Uint8Array([0x88, 0xa3, 0x69, 0x6e, 0x74, 0x1, 0xa5, 0x66, 0x6c, 0x6f, 0x61, 0x74, 0xcb, 0x3f, 0xe0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xa7, 0x62, 0x6f, 0x6f, 0x6c, 0x65, 0x61, 0x6e, 0xc3, 0xa4, 0x6e, 0x75, 0x6c, 0x6c, 0xc0, 0xa6, 0x73, 0x74, 0x72, 0x69, 0x6e, 0x67, 0xa7, 0x66, 0x6f, 0x6f, 0x20, 0x62, 0x61, 0x72, 0xa5, 0x61, 0x72, 0x72, 0x61, 0x79, 0x92, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72, 0xa6, 0x6f, 0x62, 0x6a, 0x65, 0x63, 0x74, 0x82, 0xa3, 0x66, 0x6f, 0x6f, 0x1, 0xa3, 0x62, 0x61, 0x7a, 0xcb, 0x3f, 0xe0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xa4, 0x64, 0x61, 0x74, 0x65, 0xd7, 0xff, 0xbe, 0x7f, 0x17, 0x0, 0x60, 0xf8, 0x3c, 0x5f]);

test('decoding complex', () => {
  assert.equal(decode(complex), {
    'int': 1,
    'float': 0.5,
    'boolean': true,
    'null': null,
    'string': 'foo bar',
    'array': [
      'foo',
      'bar',
    ],
    'object': {
      'foo': 1,
      'baz': 0.5,
    },
    'date': new Date(1626881119799),
  });
});

test.run();
