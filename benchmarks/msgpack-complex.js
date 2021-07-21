const { Benchmark } = require('benchmark');

const urlpack = require('@urlpack/msgpack/lib');
const msgpack5 = require('msgpack5')();
const msgpackLite = require('msgpack-lite');

new Benchmark.Suite()
.add('encode complex 1 - urlpack', () => {
  urlpack.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 1 - msgpack5', () => {
  msgpack5.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 1 - msgpack-lite', () => {
  msgpackLite.encode({ a: { b: 'c' }, c: [null, null, null, { d: 'c' }] });
})
.add('encode complex 2 - urlpack', () => {
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
  });
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
