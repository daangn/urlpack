interface MakeBaseEncoder {
  (baseAlphabet: string): {
    encode: (input: Uint8Array) => string,
  };
}

export const makeBaseEncoder: MakeBaseEncoder = baseAlphabet => {
  let n = baseAlphabet.length;
  if (n === 0 || n > 255) {
    throw new Error('Invalid base alphabet length: ' + n);
  }
  return {
    encode: input => {
      // encoding_flag:
      //  - 0: counting leading zeros
      //  - 1: processing
      let flag = 0;
      let leadingZeros = 0;
      let encoding = [];

      for (let byte of input) {
        if (!(flag || byte)) {
          leadingZeros++;
        } else {
          flag = 1;
        }

        let carry = byte;
        for (let i = 0; (carry || i < encoding.length); i++) {
          carry += encoding[i] << 8;
          encoding[i] = carry % n;
          carry = carry / n | 0;
        }
      }

      let len = leadingZeros + encoding.length;
      let values = Array(len);
      for (let i = 0; i < len; i++) {
        values[i] = baseAlphabet[
          i < leadingZeros
            ? 0
            : encoding[len - i - 1]
        ];
      }

      return values.join('');
    },
  };
};
