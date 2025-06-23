import { group, summary, barplot, bench, run } from 'mitata';

import { makeMessagePackEncoder } from '@urlpack/msgpack';
const urlpack = makeMessagePackEncoder();

import msgpack from '@msgpack/msgpack';

import _msgpack5 from 'msgpack5'
const msgpack5 = _msgpack5();

import msgpackLite from 'msgpack-lite';

import * as msgpackr from 'msgpackr';

const complex1 = {
  a: { b: 'c' },
  c: [null, null, null, { d: 'c' }],
};
const complex2 = {
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
};


group('encode complex1', () => {
  summary(() => {
    barplot(() => {
      bench('@urlpack/msgpack', () => {
        urlpack.encode(complex1);
      }).gc('inner').baseline();
      bench('@msgpack/msgpack', () => {
        msgpack.encode(complex1);
      }).gc('inner');
      bench('msgpack5', () => {
        msgpack5.encode(complex1);
      }).gc('inner');
      bench('msgpack-lite', () => {
        msgpackLite.encode(complex1);
      }).gc('inner');
      bench('msgpackr', () => {
        msgpackr.encode(complex1);
      }).gc('inner');
    });
  });
});

group('encode complex 2', () => {
  summary(() => {
    barplot(() => {
      bench('@urlpack/msgpack', () => {
        urlpack.encode(complex2);
      }).gc('inner').baseline();
      bench('@msgpack/msgpack', () => {
        msgpack.encode(complex2);
      }).gc('inner');
      bench('msgpack5', () => {
        msgpack5.encode(complex2);
      }).gc('inner');
      bench('msgpack-lite', () => {
        msgpackLite.encode(complex2);
      }).gc('inner');
      bench('msgpackr', () => {
        msgpackr.encode(complex2);
      }).gc('inner');
    });
  });
});

run();
