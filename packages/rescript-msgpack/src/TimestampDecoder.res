let \"type" = -1

// almost copy-pated from msgpack5's DateCodec implementation
// https://github.com/mcollina/msgpack5/blob/master/lib/codecs/DateCodec.js
let decode: (Js.TypedArray2.Uint8Array.t, int) => Result.t = %raw(`(array, byteLength) => {
  let view = new DataView(array.buffer);
  switch (byteLength) {
    case 4: {
      let seconds = view.getUint32(0, false);
      let millis = seconds / 1000 | 0;
      return new Date(millis);
    }
    case 8: {
      let upper = view.getUint32(0);
      let lower = view.getUint32(4);
      let nanos = upper / 4;
      let seconds = ((upper & 3) * (2 ** 32)) + lower;
      let millis = seconds * 1000 + Math.round(nanos / 1e6);
      return new Date(millis);
    }
    case 12:
      throw new Error('timestamp96 is not supported yet');
    default:
      throw new Error('invalid byteLength ' + byteLength);
  }
}`)
