!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("@urlpack/base58"),require("@urlpack/msgpack")):"function"==typeof define&&define.amd?define(["exports","@urlpack/base58","@urlpack/msgpack"],n):n((e||self).urlpack={},e.base58,e.msgpack)}(this,function(e,n,o){e.makeDecoder=function(e){void 0===e&&(e={});var c=n.decode,a=e.decodeBinary||o.makeMessagePackDecoder().decode;return{decode:function(e){return a(c(e))}}},e.makeEncoder=function(e){void 0===e&&(e={});var c=e.encodeData||o.makeMessagePackEncoder().encode,a=e.encodeBinary||n.encode;return{encode:function(e){return a(c(e))}}}});
//# sourceMappingURL=index.umd.js.map
