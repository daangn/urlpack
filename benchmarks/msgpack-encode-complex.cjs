const { Benchmark } = require('benchmark');

const { makeMessagePackEncoder } = require('@urlpack/msgpack');
const urlpack = makeMessagePackEncoder();

const msgpack = require('@msgpack/msgpack');
const msgpack5 = require('msgpack5')();
const msgpackLite = require('msgpack-lite');
const msgpackr = require('msgpackr');

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

new Benchmark.Suite()
.add('warmup', () => {
  urlpack.encode(complex1);
  msgpack.encode(complex1);
  msgpack5.encode(complex1);
  msgpackLite.encode(complex1);
  msgpackr.encode(complex1);
})
.add('encode complex 1 - @urlpack/msgpack', () => {
  urlpack.encode(complex1);
})
.add('encode complex 1 - @msgpack/msgpack', () => {
  msgpack.encode(complex1);
})
.add('encode complex 1 - msgpack5', () => {
  msgpack5.encode(complex1);
})
.add('encode complex 1 - msgpack-lite', () => {
  msgpackLite.encode(complex1);
})
.add('encode complex 1 - msgpackr', () => {
  msgpackr.encode(complex1);
})
.add('encode complex 2 - @urlpack/msgpack', () => {
  urlpack.encode(complex2);
})
.add('encode complex 2 - @msgpack/msgpack', () => {
  msgpack.encode(complex2);
})
.add('encode complex 2 - msgpack5', () => {
  msgpack5.encode(complex2);
})
.add('encode complex 2 - msgpack-lite', () => {
  msgpackLite.encode(complex2);
})
.add('encode complex 2 - msgpackr', () => {
  msgpackr.encode(complex2);
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
