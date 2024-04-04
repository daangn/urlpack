# @urlpack/qrjson

[![Package Version](https://img.shields.io/npm/v/@urlpack/qrjson)](https://npm.im/@urlpack/qrjson)
[![License](https://img.shields.io/npm/l/@urlpack/qrjson)](#License)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@urlpack/qrjson)](https://bundlephobia.com/package/@urlpack/qrjson)

Compress JSON data into compact & optimized to URL for QR Codes with numeric mode encoding

- ES Modules & Browser compatible
- Compact output using [MessagePack](https://msgpack.org/)
- Use Base10 encoding to get clear QR Code (mode=numeric) image

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
// => '1605288693315933041592216384647639863862606035591552983841613971370651694842366403819686780144511394090067728031488880352135548504776147881624581'
```

## LICENSE

MIT
