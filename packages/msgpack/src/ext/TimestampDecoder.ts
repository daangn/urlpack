import type { DecoderExtension } from './types';

export const timestampDecoder: DecoderExtension<Date> = {
  type: -1,
  // almost copy-pated from msgpack5's DateCodec implementation
  // https://github.com/mcollina/msgpack5/blob/master/lib/codecs/DateCodec.js
  decode(dataArray, byteLength) {
    let view = new DataView(dataArray.buffer);
    switch (byteLength) {
      case 4: {
        let seconds = view.getUint32(0, false);
        let millis = seconds / 1000 | 0;
        return [new Date(millis), 4];
      }
      case 8: {
        let upper = view.getUint32(0);
        let lower = view.getUint32(4);
        let nanos = upper / 4;
        let seconds = ((upper & 3) * (2 ** 32)) + lower;
        let millis = seconds * 1000 + Math.round(nanos / 1e6);
        return [new Date(millis), 8];
      }
      case 12:
        throw new Error(`timestamp96 is not supported yet`);
      default:
        throw new Error(`invalid byteLength ${byteLength}`);
    }
  },
};
