# @urlpack/base-codec

[![Package Version](https://img.shields.io/npm/v/@urlpack/base-codec)](https://npm.im/@urlpack/base-codec)
[![License](https://img.shields.io/npm/l/@urlpack/base-codec)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/base-codec)](https://bundlephobia.com/package/@urlpack/base-codec)

Pure JavaScript implementation of the Base-N codec.\
(1~255, it isn't compat with the Base16, Base32 and Base64)

- Zero dependencies
- ES Modules & Browser compatible
- Tree-shakable encoder and decoder

## Usage

```ts
import { makeBaseEncoder, makeBaseDecoder } from '@urlpack/base-codec';

// Flickr-flavored Base58 characters
const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

const encoder = makeBaseEncoder(alphabet);
encoder.encode(binary); // Uint8Array => string

const decoder = makeBaseDecoder(alphabet);
decoder.encode(str); // => string => Uint8Array
```

## Benchmark

```txt
@urlpack/base-codec encode x 987 ops/sec ±0.49% (93 runs sampled)
@urlpack/base-codec decode x 1,051 ops/sec ±0.46% (94 runs sampled)

base-x encode x 1,410 ops/sec ±0.48% (92 runs sampled)
base-x decode x 1,718 ops/sec ±2.18% (90 runs sampled)

base58-js encode x 720 ops/sec ±0.86% (93 runs sampled)
base58-js decode x 169 ops/sec ±2.05% (78 runs sampled)
```

It should be better. PR welcome

## License

MIT
