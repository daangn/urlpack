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

## About Performance

The current implementation is not very optimized.

It is suitable for use as a callback for webpage that doesn't run the codec at high frequency, etc.

If you are dealing with large data or want very high-performance, We recommend using the [official JS implementation](https://github.com/msgpack/msgpack-javascript). Other implementations may better on the Node.js environment.

## Benchmark

Run on Desktop (Intel i5-9600K (6) @ 4.600GHz), Ubuntu 20.04.3 LTS x86_64 and Node.js v16.10.0 (v8 9.3.345.19)

vs.
- [@msgpack/msgpack](https://github.com/msgpack/msgpack-javascript)
- [msgpack5](https://github.com/mcollina/msgpack5)
- [msgpack-lite](https://github.com/kawanet/msgpack-lite)

These are very common use cases and should be further optimized.

### encoding

```txt
misc - @urlpack/msgpack x 2,892,429 ops/sec ±0.84% (91 runs sampled)
misc - @msgpack/msgpack x   204,614 ops/sec ±3.14% (82 runs sampled)
misc - msgpack5         x 1,760,767 ops/sec ±0.49% (92 runs sampled)
misc - msgpack-lite     x   206,125 ops/sec ±2.67% (79 runs sampled)

positive int - @urlpack/msgpack x 3,440,455 ops/sec ±0.44% (95 runs sampled)
positive int - @msgpack/msgpack x   167,833 ops/sec ±1.97% (80 runs sampled)
positive int - msgpack5         x 1,323,809 ops/sec ±0.68% (95 runs sampled)
positive int - msgpack-lite     x   166,705 ops/sec ±2.40% (79 runs sampled)

negative int - @urlpack/msgpack x 3,079,932 ops/sec ±0.55% (95 runs sampled)
negative int - @msgpack/msgpack x   153,453 ops/sec ±2.35% (78 runs sampled)
negative int - msgpack5         x 1,744,260 ops/sec ±0.43% (96 runs sampled)
negative int - msgpack-lite     x   176,460 ops/sec ±2.22% (79 runs sampled)

float - @urlpack/msgpack x   539,287 ops/sec ±3.47% (81 runs sampled)
float - @msgpack/msgpack x   265,012 ops/sec ±2.55% (80 runs sampled)
float - msgpack5         x 2,934,269 ops/sec ±0.43% (95 runs sampled)
float - msgpack-lite     x   274,670 ops/sec ±2.15% (63 runs sampled)

string - @urlpack/msgpack x   462,670 ops/sec ±3.07% (75 runs sampled)
string - @msgpack/msgpack x   250,653 ops/sec ±2.77% (79 runs sampled)
string - msgpack5         x 1,209,516 ops/sec ±1.00% (91 runs sampled)
string - msgpack-lite     x   233,625 ops/sec ±2.06% (77 runs sampled)

bin - @urlpack/msgpack x 387,358 ops/sec ±1.51% (88 runs sampled)
bin - @msgpack/msgpack x 365,713 ops/sec ±1.00% (92 runs sampled)
bin - msgpack5         x 314,983 ops/sec ±1.21% (89 runs sampled)
bin - msgpack-lite     x 324,125 ops/sec ±0.95% (90 runs sampled)

fixarray - @urlpack/msgpack x 1,796,455 ops/sec ±0.42% (92 runs sampled)
fixarray - @msgpack/msgpack x   774,345 ops/sec ±2.29% (78 runs sampled)
fixarray - msgpack5         x   363,699 ops/sec ±1.55% (81 runs sampled)
fixarray - msgpack-lite     x   706,715 ops/sec ±2.64% (79 runs sampled)

array 8 - @urlpack/msgpack x  35,498 ops/sec ±1.74% (88 runs sampled)
array 8 - @msgpack/msgpack x 346,195 ops/sec ±1.64% (90 runs sampled)
array 8 - msgpack5         x  11,961 ops/sec ±2.50% (80 runs sampled)
array 8 - msgpack-lite     x 117,392 ops/sec ±1.56% (90 runs sampled)

array 16 - @urlpack/msgpack x    49.21 ops/sec ±3.31% (53 runs sampled)
array 16 - @msgpack/msgpack x 1,078    ops/sec ±0.89% (79 runs sampled)
array 16 - msgpack5         x    47.78 ops/sec ±3.06% (55 runs sampled)
array 16 - msgpack-lite     x   458    ops/sec ±0.99% (91 runs sampled)

fixmap - @urlpack/msgpack x 210,059 ops/sec ±2.07% (84 runs sampled)
fixmap - @msgpack/msgpack x 717,587 ops/sec ±2.40% (84 runs sampled)
fixmap - msgpack5         x 241,156 ops/sec ±0.77% (95 runs sampled)
fixmap - msgpack-lite     x 291,297 ops/sec ±1.25% (87 runs sampled)
```

### encoding (complex)

```txt
complex 1 - @urlpack/msgpack x 176,455 ops/sec ±2.23% (81 runs sampled)
complex 1 - @msgpack/msgpack x 656,150 ops/sec ±1.60% (84 runs sampled)
complex 1 - msgpack5         x 130,595 ops/sec ±0.77% (94 runs sampled)
complex 1 - msgpack-lite     x 269,092 ops/sec ±1.03% (82 runs sampled)

complex 2 - @urlpack/msgpack x  75,236 ops/sec ±2.44% (85 runs sampled)
complex 2 - @msgpack/msgpack x 377,101 ops/sec ±1.73% (85 runs sampled)
complex 2 - msgpack5         x  80,612 ops/sec ±0.52% (88 runs sampled)
complex 2 - msgpack-lite     x 136,370 ops/sec ±1.53% (86 runs sampled)
```

### decoding

```txt
misc - @urlpack/msgpack x   440,313 ops/sec ±0.47% (94 runs sampled)
misc - @msgpack/msgpack x   438,023 ops/sec ±0.70% (92 runs sampled)
misc - msgpack5         x   285,035 ops/sec ±0.36% (95 runs sampled)
misc - msgpack-lite     x 2,750,585 ops/sec ±0.36% (96 runs sampled)

positive int - @urlpack/msgpack x   367,432 ops/sec ±1.49% (88 runs sampled)
positive int - @msgpack/msgpack x   324,577 ops/sec ±1.00% (88 runs sampled)
positive int - msgpack5         x   135,978 ops/sec ±0.71% (95 runs sampled)
positive int - msgpack-lite     x 1,676,802 ops/sec ±0.44% (96 runs sampled)

negative int - @urlpack/msgpack x   354,989 ops/sec ±0.86% (85 runs sampled)
negative int - @msgpack/msgpack x   322,527 ops/sec ±0.89% (86 runs sampled)
negative int - msgpack5         x   173,402 ops/sec ±0.45% (97 runs sampled)
negative int - msgpack-lite     x 1,742,117 ops/sec ±0.18% (97 runs sampled)

float - @urlpack/msgpack x   560,581 ops/sec ±0.89% (89 runs sampled)
float - @msgpack/msgpack x   536,420 ops/sec ±0.98% (90 runs sampled)
float - msgpack5         x   263,946 ops/sec ±0.42% (97 runs sampled)
float - msgpack-lite     x 1,673,797 ops/sec ±0.14% (98 runs sampled)

str - @urlpack/msgpack x 261,537 ops/sec ±0.58% (93 runs sampled)
str - @msgpack/msgpack x 250,727 ops/sec ±1.16% (84 runs sampled)
str - msgpack5         x 274,618 ops/sec ±0.50% (96 runs sampled)
str - msgpack-lite     x 318,989 ops/sec ±0.42% (96 runs sampled)

bin - @urlpack/msgpack x 249,947 ops/sec ±0.56% (94 runs sampled)
bin - @msgpack/msgpack x 296,036 ops/sec ±0.35% (99 runs sampled)
bin - msgpack5         x 254,581 ops/sec ±0.49% (91 runs sampled)
bin - msgpack-lite     x 261,996 ops/sec ±0.32% (94 runs sampled)

fixarray - @urlpack/msgpack x 1,419,697 ops/sec ±0.38% (93 runs sampled)
fixarray - @msgpack/msgpack x 1,345,461 ops/sec ±0.81% (88 runs sampled)
fixarray - msgpack5         x   654,856 ops/sec ±0.26% (95 runs sampled)
fixarray - msgpack-lite     x 5,982,184 ops/sec ±0.34% (95 runs sampled)

array 8 - @urlpack/msgpack x 62,351 ops/sec ±0.22% (97 runs sampled)
array 8 - @msgpack/msgpack x 87,723 ops/sec ±0.42% (94 runs sampled)
array 8 - msgpack5         x 28,932 ops/sec ±0.54% (97 runs sampled)
array 8 - msgpack-lite     x 84,527 ops/sec ±0.47% (94 runs sampled)

fixmap - @urlpack/msgpack x 738,537 ops/sec ±0.28% (94 runs sampled)
fixmap - @msgpack/msgpack x 922,908 ops/sec ±0.71% (94 runs sampled)
fixmap - msgpack5         x 253,995 ops/sec ±0.46% (94 runs sampled)
fixmap - msgpack-lite     x 746,095 ops/sec ±0.19% (91 runs sampled)
```

### decoding (complex)

```txt
complex 1 - @urlpack/msgpack x   718,817 ops/sec ±0.76% (93 runs sampled)
complex 1 - @msgpack/msgpack x 1,502,565 ops/sec ±0.29% (90 runs sampled)
complex 1 - msgpack5         x   301,826 ops/sec ±0.22% (98 runs sampled)
complex 1 - msgpack-lite     x   668,763 ops/sec ±0.33% (93 runs sampled)

complex 2 - @urlpack/msgpack x 295,942 ops/sec ±0.32% (96 runs sampled)
complex 2 - @msgpack/msgpack x 715,786 ops/sec ±0.19% (96 runs sampled)
complex 2 - msgpack5         x 122,310 ops/sec ±0.37% (94 runs sampled)
complex 2 - msgpack-lite     x 208,953 ops/sec ±0.25% (98 runs sampled)
```

## License

MIT
