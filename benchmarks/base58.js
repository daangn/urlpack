import _benchmark from 'benchmark';
const { Benchmark } = _benchmark;

import { makeBaseEncoder, makeBaseDecoder } from '@urlpack/base-codec';
import baseXCodec from 'base-x';
import * as base58js from 'base58-js';

const baseAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const urlpack = {
  ...makeBaseEncoder(baseAlphabet),
  ...makeBaseDecoder(baseAlphabet),
};
const baseX = baseXCodec(baseAlphabet);

const buffer = Buffer.from(`
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`);
const text = urlpack.encode(buffer);

new Benchmark.Suite()
.add('@urlpack/base-codec encode', () => {
  urlpack.encode(buffer);
})
.add('@urlpack/base-codec decode', () => {
  urlpack.decode(text);
})
.add('base-x encode', () => {
  baseX.encode(buffer);
})
.add('base-x decode', () => {
  baseX.decode(text);
})
.add('base58-js encode', () => {
  base58js.binary_to_base58(buffer);
})
.add('base58-js decode', () => {
  base58js.base58_to_binary(text);
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
