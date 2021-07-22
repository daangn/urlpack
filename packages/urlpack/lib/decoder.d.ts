declare type DecoderOptions<Data> = {
    decodeString?: (str: string) => Uint8Array;
    decodeBinary?: (binary: Uint8Array) => Data;
};
export declare function makeDecoder<Data>(options?: DecoderOptions<Data>): {
    decode: (str: string) => Data;
};
export {};
