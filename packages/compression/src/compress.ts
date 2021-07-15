import type { Input } from './types';

interface Compress {
  (input: Input): Uint8Array;
}

const uint32max = 0xffffffff + 1;

const numberUint8Array = (input: number, bits: 8 | 16 | 32 | 64, header?: number) => {
  const array = [];

  if(header)
    array.push(header);

  if(bits === 64){
    const lo = input % uint32max;
    const hi = ~~(input / uint32max);

    for(let i = 24; i >= 0; i -= 8){
      array.push(0xff & (hi >> i))
    }

    for(let i = 24; i >= 0; i -= 8){
      array.push(0xff & (lo >> i))
    }

    return new Uint8Array(array);
  }

  for(let i = bits - 8; i >= 0; i -= 8){
    array.push(0xff & (input >> i))
  }

  return new Uint8Array(array);
}

const compressNumber = (input: number) => {
  if (input >= 0) {
    if (input < 128) {
      return numberUint8Array(input, 8);
    } else if (input < 256) {
      return numberUint8Array(input, 8, 0xcc);
    } else if (input < 65536) {      
      return numberUint8Array(input, 16, 0xcd);
    } else if (input < uint32max) {
      return numberUint8Array(input, 32, 0xce);
    } else if (input <= 9007199254740991) {        
      return numberUint8Array(input, 64, 0xcf);
    }
  }else{
    if(input >= -32){
      return numberUint8Array((0x100 + input), 8);
    } else if(input >= -128){
      return numberUint8Array(input, 8, 0xd0);
    } else if(input >= -32768){
      return numberUint8Array(input, 16, 0xd1);
    } else if(input > -214748365){
      return numberUint8Array(input, 32, 0xd2);
    } else if(input >= -9007199254740991){
      const num = Math.abs(input);

      const absArray = numberUint8Array(num, 64, 0xd3);  
      let i = absArray.length;
      
      while(i-- > 1){
        if(absArray[i] !== 0x00){
          absArray[i] = (absArray[i] ^ 0xff) + 1;
          break;
        }
      }

      while(i-- > 1){
        absArray[i] = absArray[i] ^ 0xff;
      }

      return absArray;
    }
  }

  return new Uint8Array();
};

export const compressString = (input: string) => {
  const array = new TextEncoder().encode(input);

  if(array.length < 32){
    return new Uint8Array([0xa0 | array.length, ...array])
  } else if(array.length < 256){
    return new Uint8Array([0xd9,  array.length, ...array])
  }else if(array.length < 65536){
    return new Uint8Array([0xda, 0xff & (array.length >> 8), 0xff & array.length, ...array])
  }else if(array.length < 4294967296){
    return new Uint8Array([0xdb, 0xff & (array.length >> 24), 0xff & (array.length >> 16), 0xff & (array.length >> 8), 0xff & array.length, ...array]);
  }

  return new Uint8Array();
}

export const compressBinary = (input: Uint8Array) => {
  if(input.length < 256){
    return new Uint8Array([0xc4,  input.length, ...input])
  }else if(input.length < 65536){
    return new Uint8Array([0xc5, 0xff & (input.length >> 8), 0xff & input.length, ...input])
  }else if(input.length < 4294967296){
    return new Uint8Array([0xc6, 0xff & (input.length >> 24), 0xff & (input.length >> 16), 0xff & (input.length >> 8), 0xff & input.length, ...input]);
  }

  return new Uint8Array();
};

export const compress: Compress = input => {

  if(typeof input === 'number'){
    return compressNumber(input);
  }

  if(typeof input === 'string'){
    return compressString(input);
  }

  if(input instanceof Uint8Array){
    return compressBinary(input);
  }

  if(input === true){
    return new Uint8Array([0xC3]);
  }

  if(input === false){
    return new Uint8Array([0xC2]);
  }

  if(input === null){
    return new Uint8Array([0xC0]);
  }

  return new Uint8Array();
};
