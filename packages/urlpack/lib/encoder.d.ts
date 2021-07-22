declare type EncoderOptions<Data> = {
    encodeData?: (data: Data) => Uint8Array;
    encodeBinary?: (binary: Uint8Array) => string;
};
export declare function makeEncoder<Data>(options?: EncoderOptions<Data>): {
    encode: (data: Data) => string;
};
export {};
