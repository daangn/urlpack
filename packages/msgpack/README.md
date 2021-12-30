# @urlpack/msgpack

[![Package Version](https://img.shields.io/npm/v/@urlpack/msgpack)](https://npm.im/@urlpack/msgpack)
[![License](https://img.shields.io/npm/l/@urlpack/msgpack)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/msgpack)](https://bundlephobia.com/package/@urlpack/msgpack)

Pure JavaScript implementation of the [MessagePack](https://msgpack.org/) codec. (See [specification](https://github.com/msgpack/msgpack/blob/master/spec.md))

- Lightweight (only ~3KB min-gzipped)
- Zero dependencies (No Node.js dependencies)
- ES Modules & Web compatible
- Tree-shakable, DCE-friendly both encoder and decoder

## Usage

```ts
import { makeMessagePackEncoder, makeMessagePackEncoder } from '@urlpack/msgpack';

const encoder = makeMessagePackEncoder();
const decoder = makeMessagePackDecoder();

encoder.encode(data); // JSON => Uint8Array
decoder.decode(binary); // Uint8Array => JSON
```

### Using custom extensions

You can use your own [extension](https://github.com/msgpack/msgpack/blob/master/spec.md#extension-types) codecs.

encoder:
```ts
import type { EncoderExtension } from '@urlpack/msgpack';

const myEncoderExtension: EncoderExtension<MyObject> = {
  type: 1, // 0 ~ 127

  check(input): input is MyObject {
    // validate input object is my extension type
  },

  encode(input) {/* encode input object to binary */}
};

const encoderExt = makeMessagePackEncoder({
  encoderExtensions: [myEncoderExtension],
});
```

decoder:
```ts
import type { DecoderExtension } from '@urlpack/msgpack';

const myDecoderExtension: DecoderExtension<MyObject> = {
  type: 1, // 0 ~ 127

  /**
   * - binary is Uint8Array that start from data part
   * - byteLength notice how many bytes you have to read
   */
  decode(binary, length) { /* should returns decoded MyObject */ },
};

const decoderExt = makeMessagePackDecoder({
  decoderExtensions: [myDecoderExtension],
});
```

## About performance

The current implementation is not that optimized.

It is suitable for use as a callback for webpage that doesn't run the codec at high frequency, etc.

If you are dealing with large data or want very high-performance, We recommend using the [official JS implementation](https://github.com/msgpack/msgpack-javascript) or [msgpackr](https://github.com/kriszyp/msgpackr).

## Benchmark

Run on Desktop (Intel i5-9600K (6) @ 4.600GHz), Ubuntu 20.04.3 LTS x86_64 and Node.js v16.10.0 (v8 9.3.345.19)

@urlpack/msgpack v1.0.3 vs.
- [@msgpack/msgpack](https://github.com/msgpack/msgpack-javascript) v2.7.1
- [msgpack5](https://github.com/mcollina/msgpack5) v5.3.2
- [msgpack-lite](https://github.com/kawanet/msgpack-lite) v0.1.26
- [msgpackr](https://github.com/kriszyp/msgpackr)

### Bundle stats

|                  | Size   | Size (min+gzipped) | ESM support?*       | DCE-friendly?* | Zero-dependencies* |
|:-----------------|-------:|-------------------:|---------------------|----------------|--------------------|
| @urlpack/msgpack | 8.4kB  | 2.5kB              | ✔                   | ✔              | ✔                  |
| @msgpack/msgpack | 28.5kB | 7.3kB              | 🟡 (No export map)  | ✔              | ✔                  |
| msgpack-lite     | 24.9kB | 7.8kB              | ❌                  | ❌             | ❌                 |
| msgpackr         | 22.8kB | 8.2kB              | ✔                   | ✔              | ✔                  |

* Packages should provide an ESM bundle and an export map so that it can be resolved on the Node.js environment.
* Encoder and decoder should be separated modules to eliminate unnecessary code on a production build.
* Additional shims are required for browsers if the package depends on Node APIs (e.g. `Buffer`).

### Encoding speed

```txt
complex 1 - @urlpack/msgpack x   260,677 ops/sec ±0.78% (86 runs sampled)
complex 1 - @msgpack/msgpack x   578,810 ops/sec ±1.47% (85 runs sampled)
complex 1 - msgpack5         x   146,834 ops/sec ±0.62% (98 runs sampled)
complex 1 - msgpack-lite     x   327,080 ops/sec ±1.07% (89 runs sampled)
complex 1 - msgpackr         x 2,886,374 ops/sec ±0.10% (100 runs sampled)

complex 2 - @urlpack/msgpack x    90,249 ops/sec ±0.92% (80 runs sampled)
complex 2 - @msgpack/msgpack x   387,485 ops/sec ±1.95% (82 runs sampled)
complex 2 - msgpack5         x    89,493 ops/sec ±0.59% (95 runs sampled)
complex 2 - msgpack-lite     x   163,182 ops/sec ±0.99% (95 runs sampled)
complex 2 - msgpackr         x 1,237,754 ops/sec ±0.21% (98 runs sampled)
```

### Decoding speed

```txt
complex 1 - @urlpack/msgpack x   720,383 ops/sec ±1.12% (94 runs sampled)
complex 1 - @msgpack/msgpack x 1,454,144 ops/sec ±0.28% (98 runs sampled)
complex 1 - msgpack5         x   308,814 ops/sec ±0.23% (99 runs sampled)
complex 1 - msgpack-lite     x   641,485 ops/sec ±0.52% (93 runs sampled)
complex 1 - msgpackr         x 3,735,642 ops/sec ±0.22% (96 runs sampled)

complex 2 - @urlpack/msgpack x   295,788 ops/sec ±0.46% (98 runs sampled)
complex 2 - @msgpack/msgpack x   707,526 ops/sec ±0.20% (97 runs sampled)
complex 2 - msgpack5         x   125,554 ops/sec ±0.16% (97 runs sampled)
complex 2 - msgpack-lite     x   200,795 ops/sec ±1.80% (97 runs sampled)
complex 2 - msgpackr         x 1,287,906 ops/sec ±0.19% (100 runs sampled)
```

## License

MIT
