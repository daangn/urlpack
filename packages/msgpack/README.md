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
import { makeMessagePackEncoder, makeMessagePackDecoder } from '@urlpack/msgpack';

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
| @urlpack/msgpack | 9.2kB  | 3.2kB              | ✔                   | ✔              | ✔                  |
| @msgpack/msgpack | 29.5kB | 7.5kB              | 🟡 (No export map)  | ✔              | ✔                  |
| msgpack-lite     | 24.9kB | 7.8kB              | ❌                  | ❌             | ❌                 |
| msgpackr         | 27.5kB | 9.9kB              | ✔                   | ✔              | ✔                  |

* Packages should provide an ESM bundle and an export map so that it can be resolved on the Node.js environment.
* Encoder and decoder should be separated modules to eliminate unnecessary code on a production build.
* Additional shims are required for browsers if the package depends on Node APIs (e.g. `Buffer`).

### Encoding speed

```txt
encode complex 1 - @urlpack/msgpack x   555,240 ops/sec ±1.45% (91 runs sampled)
encode complex 1 - @msgpack/msgpack x 1,487,981 ops/sec ±0.89% (91 runs sampled)
encode complex 1 - msgpack5         x   187,549 ops/sec ±0.62% (97 runs sampled)
encode complex 1 - msgpack-lite     x   888,246 ops/sec ±0.66% (96 runs sampled)
encode complex 1 - msgpackr         x 5,192,484 ops/sec ±0.48% (99 runs sampled)

encode complex 2 - @urlpack/msgpack x   214,766 ops/sec ±0.75% (94 runs sampled)
encode complex 2 - @msgpack/msgpack x   797,785 ops/sec ±0.80% (96 runs sampled)
encode complex 2 - msgpack5         x   128,513 ops/sec ±0.60% (94 runs sampled)
encode complex 2 - msgpack-lite     x   385,248 ops/sec ±0.58% (96 runs sampled)
encode complex 2 - msgpackr         x 2,219,375 ops/sec ±0.31% (101 runs sampled)
```

### Decoding speed

```txt
decode complex 1 - @urlpack/msgpack x 1,270,298 ops/sec ±0.93% (97 runs sampled)
decode complex 1 - @msgpack/msgpack x 2,399,679 ops/sec ±0.30% (100 runs sampled)
decode complex 1 - msgpack5         x   482,239 ops/sec ±0.52% (98 runs sampled)
decode complex 1 - msgpack-lite     x 1,199,416 ops/sec ±0.28% (99 runs sampled)
decode complex 1 - msgpackr         x 5,277,932 ops/sec ±0.37% (93 runs sampled)

decode complex 2 - @urlpack/msgpack x   476,016 ops/sec ±0.26% (99 runs sampled)
decode complex 2 - @msgpack/msgpack x 1,109,229 ops/sec ±0.31% (100 runs sampled)
decode complex 2 - msgpack5         x   204,347 ops/sec ±0.50% (99 runs sampled)
decode complex 2 - msgpack-lite     x   357,116 ops/sec ±0.91% (95 runs sampled)
decode complex 2 - msgpackr         x 2,181,796 ops/sec ±0.28% (96 runs sampled)
```

## License

MIT
