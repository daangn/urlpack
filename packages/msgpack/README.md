# @urlpack/msgpack

[![Package Version](https://img.shields.io/npm/v/@urlpack/msgpack)](https://npm.im/@urlpack/msgpack)
[![License](https://img.shields.io/npm/l/@urlpack/msgpack)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/msgpack)](https://bundlephobia.com/package/@urlpack/msgpack)

Pure JavaScript implementation of the [MessagePack](https://msgpack.org/) codec. (See [specification](https://github.com/msgpack/msgpack/blob/master/spec.md))

- Lightweight (only ~2.6KB min-gzipped)
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
  check(input): input is MyObject {
    // validate input object is my extension type
  }

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
  decode(binary, byteLength) {
    // It should return a tuple of the decoded MyObject and the number of bytes actually read.
    return [data as MyObject, readBytes];
  },
};

const decoderExt = makeMessagePackDecoder({
  decoderExtensions: [myDecoderExtension],
});
```

## About Performance

The current implementation is not very optimized.

It is suitable for use as a callback for webpage that doesn't run the codec at high frequency, etc.

If you are dealing with large data or want very high-performance, We recommend using the [official JS implementation]. Other implementations may better on the Node.js environment.

## Benchmark

Run on MacBook Pro 16 (2.6 GHz 6-Core Intel Core i7), macOS Big Sur v11.4 and Node.js v14.17.0 (v8 8.4.371.23)

vs.
- [@msgpack/msgpack](https://github.com/msgpack/msgpack-javascript)
- [msgpack5](https://github.com/mcollina/msgpack5)
- [msgpack-lite](https://github.com/kawanet/msgpack-lite)

It is slow for large arrays, maps, and complex structures. And it is very bed at decoding yet.

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
misc - @urlpack/msgpack x 2,455,984 ops/sec ±0.97% (94 runs sampled)
misc - @msgpack/msgpack x   304,603 ops/sec ±2.87% (79 runs sampled)
misc - msgpack5         x   214,451 ops/sec ±1.57% (85 runs sampled)
misc - msgpack-lite     x 2,375,852 ops/sec ±2.13% (87 runs sampled)

positive int - @urlpack/msgpack   x 359,746 ops/sec ±1.88% (86 runs sampled)
positive int - @msgpack/msgpack   x 237,743 ops/sec ±3.76% (76 runs sampled)
positive int - msgpack5           x 115,580 ops/sec ±1.18% (86 runs sampled)
positive int - msgpack-lite     x 1,614,425 ops/sec ±0.71% (96 runs sampled)

negative int - @urlpack/msgpack   x 340,592 ops/sec ±2.87% (84 runs sampled)
negative int - @msgpack/msgpack   x 246,673 ops/sec ±2.55% (81 runs sampled)
negative int - msgpack5           x 138,023 ops/sec ±1.50% (89 runs sampled)
negative int - msgpack-lite     x 1,569,078 ops/sec ±1.45% (88 runs sampled)

float - @urlpack/msgpack x 430,572 ops/sec ±3.86% (76 runs sampled)
float - @msgpack/msgpack x 400,951 ops/sec ±3.10% (80 runs sampled)
float - msgpack5         x 215,972 ops/sec ±1.49% (88 runs sampled)
float - msgpack-lite     x 1,635,116 ops/sec ±0.78% (88 runs sampled)

str - @urlpack/msgpack x 111,567 ops/sec ±2.10% (76 runs sampled)
str - @msgpack/msgpack x 154,093 ops/sec ±3.34% (71 runs sampled)
str - msgpack5         x 154,117 ops/sec ±2.29% (78 runs sampled)
str - msgpack-lite     x 241,490 ops/sec ±1.54% (79 runs sampled)

bin - @urlpack/msgpack x 226,284 ops/sec ±2.27% (83 runs sampled)
bin - @msgpack/msgpack x 273,575 ops/sec ±2.12% (90 runs sampled)
bin - msgpack5         x 229,914 ops/sec ±1.43% (94 runs sampled)
bin - msgpack-lite     x 241,549 ops/sec ±0.72% (89 runs sampled)

fixarray - @urlpack/msgpack x 1,717,264 ops/sec ±1.42% (89 runs sampled)
fixarray - @msgpack/msgpack x   943,892 ops/sec ±2.93% (78 runs sampled)
fixarray - msgpack5         x   546,138 ops/sec ±1.41% (89 runs sampled)
fixarray - msgpack-lite     x 4,832,138 ops/sec ±1.98% (90 runs sampled)

array 8 - @urlpack/msgpack x  7,457 ops/sec ±2.77% (82 runs sampled)
array 8 - @msgpack/msgpack x 82,472 ops/sec ±1.27% (93 runs sampled)
array 8 - msgpack5         x 25,852 ops/sec ±2.35% (90 runs sampled)
array 8 - msgpack-lite     x 76,595 ops/sec ±0.62% (85 runs sampled)

fixmap - @urlpack/msgpack x  74,343 ops/sec ±3.63% (73 runs sampled)
fixmap - @msgpack/msgpack x 682,766 ops/sec ±1.81% (83 runs sampled)
fixmap - msgpack5         x 170,771 ops/sec ±2.10% (84 runs sampled)
fixmap - msgpack-lite     x 679,037 ops/sec ±1.41% (90 runs sampled)
```

### decoding (complex)

```txt
complex 1 - @urlpack/msgpack x    69,076 ops/sec ±0.95% (90 runs sampled)
complex 1 - @msgpack/msgpack x 1,299,590 ops/sec ±0.49% (95 runs sampled)
complex 1 - msgpack5         x   250,499 ops/sec ±2.28% (84 runs sampled)
complex 1 - msgpack-lite     x   550,986 ops/sec ±2.66% (86 runs sampled)

complex 2 - @urlpack/msgpack x  25,727 ops/sec ±2.65% (85 runs sampled)
complex 2 - @msgpack/msgpack x 544,204 ops/sec ±2.88% (85 runs sampled)
complex 2 - msgpack5         x 102,003 ops/sec ±2.35% (77 runs sampled)
complex 2 - msgpack-lite     x 172,922 ops/sec ±1.78% (86 runs sampled)
```

## License

MIT
