const { Benchmark } = require('benchmark');

const urlpack = require('@urlpack/msgpack/lib');
const msgpack = require('@msgpack/msgpack');
const msgpack5 = require('msgpack5')();
const msgpackLite = require('msgpack-lite');

const date = new Date(1626881119799);

new Benchmark.Suite()
.add('encode complex 1 - @urlpack/msgpack', () => {
  urlpack.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 1 - @msgpack/msgpack', () => {
  msgpack.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 1 - msgpack5', () => {
  msgpack5.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 1 - msgpack-lite', () => {
  msgpackLite.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 2 - @urlpack/msgpack', () => {
  urlpack.encode({
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
    date,
  });
})
.add('encode complex 2 - @msgpack/msgpack', () => {
  msgpack.encode({
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
    date,
  });
})
.add('encode complex 2 - msgpack5', () => {
  msgpack5.encode({
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
    date,
  });
})
.add('encode complex 2 - msgpack-lite', () => {
  msgpackLite.encode({
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
    date,
  });
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
