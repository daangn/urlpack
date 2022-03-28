const { Benchmark } = require('benchmark');

const textEncoder = new TextEncoder();

const utf8EncodeJs = (str) => {
  let strLength = str.length;
  let output = [];
  let offset = 0;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);

    if ((value & 0xffffff80) === 0) {
      // 1-byte
      output[offset++] = value;
      continue;
    } else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
    } else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (pos < strLength) {
          let extra = str.charCodeAt(pos);
          if ((extra & 0xfc00) === 0xdc00) {
            ++pos;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
      }

      if ((value & 0xffff0000) === 0) {
        // 3-byte
        output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
        output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      } else {
        // 4-byte
        output[offset++] = ((value >> 18) & 0x07) | 0xf0;
        output[offset++] = ((value >> 12) & 0x3f) | 0x80;
        output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      }
    }

    output[offset++] = (value & 0x3f) | 0x80;
  }

  return new Uint8Array(output);
}

const text = '안녕, 세상!';

console.log(textEncoder.encode(text));
console.log(utf8EncodeJs(text));

new Benchmark.Suite()
.add('TextEncoder', () => {
  textEncoder.encode(text);
})
.add('utf8EncodeJs', () => {
  utf8EncodeJs(text);
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
