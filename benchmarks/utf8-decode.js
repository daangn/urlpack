const { Benchmark } = require('benchmark');

const textDecoder = new TextDecoder();

const utf8DecodeJs = (function (bytes) {
  let offset = 0;
  const end = bytes.length;

  const units = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++];
    if ((byte1 & 0x80) === 0) {
      // 1 byte
      units.push(byte1);
    } else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      const byte2 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 6) | byte2);
    } else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      const byte2 = bytes[offset++] & 0x3f;
      const byte3 = bytes[offset++] & 0x3f;
      units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    } else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      const byte2 = bytes[offset++] & 0x3f;
      const byte3 = bytes[offset++] & 0x3f;
      const byte4 = bytes[offset++] & 0x3f;
      let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (unit > 0xffff) {
        unit -= 0x10000;
        units.push(((unit >>> 10) & 0x3ff) | 0xd800);
        unit = 0xdc00 | (unit & 0x3ff);
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }

    if (units.length >= 0x1_000) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }

  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }

  return result;
});

const textEncoded = new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]);

new Benchmark.Suite()
.add('TextDecoder', () => {
  textDecoder.decode(textEncoded);
})
.add('utf8DecodeJs', () => {
  utf8DecodeJs(textEncoded);
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
