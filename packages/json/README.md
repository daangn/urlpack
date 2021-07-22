# @urlpack/json

[![Package Version](https://img.shields.io/npm/v/urlpack)](https://npm.im/@urlpack/json)
[![License](https://img.shields.io/npm/l/@urlpack/json)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/json)](https://bundlephobia.com/package/@urlpack/json)

Compress JSON data into compact & URL-safe formats

- ES Modules & Browser compatible
- Compact output using [MessagePack](https://msgpack.org/)
- URL safe formats (Base62, Base58)
- Composable & Tree-shakable

## Usage

```ts
const { makeJsonEncoder } from '@urlpack/json';

const encoder = makeJsonEncoder();

encoder.encode({
  href: 'http://daangn.com',
  uid: 1234567,
  context: {
    foo: 'bar',
    baz: [1,2,3,4,5],
  },
})
// => 'QL3sGqgSwhebCV6jsPsxSCG6DPGZUAo7qtLbEFxFN3bequ3qABcg6pxvpvr36FveMxCtD4zNSWSpHmxgz8'
//
// Only 82 characters, 35% smaller output than JSON.stringify + lz-string
```

## LICENSE

MIT
