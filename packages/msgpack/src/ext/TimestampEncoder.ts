import type { EncoderExtension } from './types';

let uint64bound = 0x100000000;

export const timestampEncoder: EncoderExtension<Date> = {
  check(input): input is Date {
    return input instanceof Date;
  },
  encode(input) {
    let millis = input.getTime();
    let seconds = millis / 1000 | 0;
    let nanos = (millis - (seconds * 1000)) * 1e6;
    let bound = uint64bound - 1;

    if (nanos || seconds > bound) {
      let array = new Uint8Array(10);
      let view = new DataView(array.buffer);
      let upperNanos = nanos * 4;
      let upperSeconds = seconds / uint64bound;
      let upper = (upperNanos + upperSeconds) & bound;
      let lower = seconds & bound;
      view.setUint8(0, 0xd7);
      view.setInt8(1, -1);
      view.setUint32(2, upper, false);
      view.setUint32(6, lower, false);
      return array;
    } else {
      let array = new Uint8Array(6);
      let view = new DataView(array.buffer);
      view.setUint8(0, 0xd6);
      view.setInt8(1, -1);
      view.setUint32(2, millis / 1000 | 0, false);
      return array;
    }
  },
};
