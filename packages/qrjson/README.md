# @urlpack/qrjson

[![Package Version](https://img.shields.io/npm/v/@urlpack/qrjson)](https://npm.im/@urlpack/qrjson)
[![License](https://img.shields.io/npm/l/@urlpack/qrjson)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/qrjson)](https://bundlephobia.com/package/@urlpack/qrjson)

Compress JSON data into compact & optimized to URL for QR Codes

- ES Modules & Browser compatible
- Compact output using [MessagePack](https://msgpack.org/)
- Use Base10 encoding to get clear QR Code image

## Usage

```ts
import { makeQrJsonEncoder } from '@urlpack/qrjson';

const encoder = makeQrJsonEncoder();

encoder.encode({
  href: 'http://daangn.com',
  uid: 1234567,
  context: {
    foo: 'bar',
    baz: [1, 2, 3, 4, 5],
  },
});
// => 'QL3sGqgSwhebCV6jsPsxSCG6DPGZUAo7qtLbEFxFN3bequ3qABcg6pxvpvr36FveMxCtD4zNSWSpHmxgz8'
//
// Only 82 characters, 35% smaller output than JSON.stringify + lz-string
```

## LICENSE

MIT
