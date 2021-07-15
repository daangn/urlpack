import type { Input } from './types';

interface Decompress {
  (input: Uint8Array): Input;
}

export const decompress: Decompress = input => {
  const first = input[0];

  if(first < 0x80){
    return first;
  }else if (first < 0x90){
    return null;
  } else if (first < 0xa0){  
    return null;
  }else if (first < 0xc0){
    const length = 0x1f & first;
    return new TextDecoder().decode(input.slice(1, length + 1));
  }else if(first === 0xc0){
    return null;
  }else if(first === 0xc1){
    return null;
  }else if(first === 0xc2){
    return false;
  }else if(first === 0xc3){
    return true;
  }else if(first === 0xc4){
    const length = input[1];
    return input.slice(2, length + 2);
  }else if (first === 0xc5){
    const length = new DataView(input.buffer).getUint16(1, false);
    return input.slice(3, length + 3);
  }else if (first === 0xc6){
    const length = new DataView(input.buffer).getUint32(1, false);
    return input.slice(5, length + 5);
  }else if(first === 0xc7){
    return null;
  }else if(first === 0xc8){
    return null;
  }else if(first === 0xc9){
    return null;
  }else if(first === 0xca){
    return null;
  }else if(first === 0xcb){
    return null;
  }else if(first === 0xcc){
    return input[1];
  }else if(first === 0xcd){
    return new DataView(input.buffer).getUint16(1, false);
  }else if(first === 0xce){
    return new DataView(input.buffer).getUint32(1, false);
  }else if(first === 0xcf){
    const hi = new DataView(input.buffer).getUint32(1, false);
    const lo = new DataView(input.buffer).getUint32(5, false);

    return (hi * Math.pow(256, 4)) + lo;
  }else if(first === 0xd0){    
    return new DataView(input.buffer).getInt8(1);
  }else if(first === 0xd1){
    return new DataView(input.buffer).getInt16(1, false);
  }else if(first === 0xd2){
    return new DataView(input.buffer).getInt32(1, false);
  }else if(first === 0xd3){

    let carry = 1
    for (let i = 8; i >= 1; i--) {
      const v = (input[i] ^ 0xff) + carry;
      input[i] = v & 0xff;
      carry = v >> 8;
    }

    const hi = new DataView(input.buffer).getUint32(1, false);
    const lo = new DataView(input.buffer).getUint32(5, false);

    return ((hi * Math.pow(256, 4)) + lo) * -1;
  }else if(first === 0xd4){
    return null;
  }else if(first === 0xd5){
    return null;
  }else if(first === 0xd6){
    return null;
  }else if(first === 0xd7){
    return null;
  }else if(first === 0xd8){
    return null;
  }else if(first === 0xd9){
    const length = input[1];
    return new TextDecoder().decode(input.slice(2, length + 2));
  }else if(first === 0xda){
    const length = new DataView(input.buffer).getUint16(1, false);
    return new TextDecoder().decode(input.slice(3, length + 3));
  }else if(first === 0xdb){
    const length = new DataView(input.buffer).getUint32(1, false);
    return new TextDecoder().decode(input.slice(5, length + 5));
  }else if(first === 0xdc){
    return null;
  }else if(first === 0xdd){
    return null;
  }else if(first === 0xde){
    return null;
  }else if(first === 0xdf){
    return null;
  }else if(first < 0x100){
    return ((first ^ 0xff) + 1) * -1;
  }

  return '';
};
