import _benchmark from 'benchmark';
const { Benchmark } = _benchmark;

import { makeMessagePackDecoder } from '@urlpack/msgpack';
const urlpack = makeMessagePackDecoder();

import msgpack from '@msgpack/msgpack';

import _msgpack5 from 'msgpack5';
const msgpack5 = _msgpack5();

import msgpackLite from 'msgpack-lite';

import * as msgpackr from 'msgpackr';

new Benchmark.Suite()
.add('decode misc - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0]));
  urlpack.decode(new Uint8Array([0xc0]));
  urlpack.decode(new Uint8Array([0xc3]));
  urlpack.decode(new Uint8Array([0xc2]));
})
.add('decode misc - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0]));
  msgpack.decode(new Uint8Array([0xc0]));
  msgpack.decode(new Uint8Array([0xc3]));
  msgpack.decode(new Uint8Array([0xc2]));
})
.add('decode misc - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0]));
  msgpack5.decode(new Uint8Array([0xc0]));
  msgpack5.decode(new Uint8Array([0xc3]));
  msgpack5.decode(new Uint8Array([0xc2]));
})
.add('decode misc - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0]));
  msgpackLite.decode(new Uint8Array([0xc0]));
  msgpackLite.decode(new Uint8Array([0xc3]));
  msgpackLite.decode(new Uint8Array([0xc2]));
})
.add('decode misc - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0]));
  msgpackr.decode(new Uint8Array([0xc0]));
  msgpackr.decode(new Uint8Array([0xc3]));
  msgpackr.decode(new Uint8Array([0xc2]));
})
.add('decode positive int - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0x01]));
  urlpack.decode(new Uint8Array([0xcd, 0x01, 0x00]));
  urlpack.decode(new Uint8Array([0xce, 0x00, 0x01, 0x00, 0x00]));
  urlpack.decode(new Uint8Array([0xcf, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  urlpack.decode(new Uint8Array([0xcf, 0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
})
.add('decode positive int - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0x01]));
  msgpack.decode(new Uint8Array([0xcd, 0x01, 0x00]));
  msgpack.decode(new Uint8Array([0xce, 0x00, 0x01, 0x00, 0x00]));
  msgpack.decode(new Uint8Array([0xcf, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  msgpack.decode(new Uint8Array([0xcf, 0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
})
.add('decode positive int - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0x01]));
  msgpack5.decode(new Uint8Array([0xcd, 0x01, 0x00]));
  msgpack5.decode(new Uint8Array([0xce, 0x00, 0x01, 0x00, 0x00]));
  msgpack5.decode(new Uint8Array([0xcf, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  msgpack5.decode(new Uint8Array([0xcf, 0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
})
.add('decode positive int - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0x01]));
  msgpackLite.decode(new Uint8Array([0xcd, 0x01, 0x00]));
  msgpackLite.decode(new Uint8Array([0xce, 0x00, 0x01, 0x00, 0x00]));
  msgpackLite.decode(new Uint8Array([0xcf, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  msgpackLite.decode(new Uint8Array([0xcf, 0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
})
.add('decode positive int - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0x01]));
  msgpackr.decode(new Uint8Array([0xcd, 0x01, 0x00]));
  msgpackr.decode(new Uint8Array([0xce, 0x00, 0x01, 0x00, 0x00]));
  msgpackr.decode(new Uint8Array([0xcf, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  msgpackr.decode(new Uint8Array([0xcf, 0x00, 0x1f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));
})
.add('decode negative int - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0xff]));
  urlpack.decode(new Uint8Array([0xd1, 0xff, 0x00]));
  urlpack.decode(new Uint8Array([0xd2, 0xff, 0xff, 0x00, 0x00]));
  urlpack.decode(new Uint8Array([0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]));
  urlpack.decode(new Uint8Array([0xd3, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
})
.add('decode negative int - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0xff]));
  msgpack.decode(new Uint8Array([0xd1, 0xff, 0x00]));
  msgpack.decode(new Uint8Array([0xd2, 0xff, 0xff, 0x00, 0x00]));
  msgpack.decode(new Uint8Array([0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]));
  msgpack.decode(new Uint8Array([0xd3, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
})
.add('decode negative int - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0xff]));
  msgpack5.decode(new Uint8Array([0xd1, 0xff, 0x00]));
  msgpack5.decode(new Uint8Array([0xd2, 0xff, 0xff, 0x00, 0x00]));
  msgpack5.decode(new Uint8Array([0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]));
  msgpack5.decode(new Uint8Array([0xd3, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
})
.add('decode negative int - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0xff]));
  msgpackLite.decode(new Uint8Array([0xd1, 0xff, 0x00]));
  msgpackLite.decode(new Uint8Array([0xd2, 0xff, 0xff, 0x00, 0x00]));
  msgpackLite.decode(new Uint8Array([0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]));
  msgpackLite.decode(new Uint8Array([0xd3, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
})
.add('decode negative int - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0xff]));
  msgpackr.decode(new Uint8Array([0xd1, 0xff, 0x00]));
  msgpackr.decode(new Uint8Array([0xd2, 0xff, 0xff, 0x00, 0x00]));
  msgpackr.decode(new Uint8Array([0xd3, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00]));
  msgpackr.decode(new Uint8Array([0xd3, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]));
})
.add('decode float - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0xca, 0x3f, 0x00, 0x00, 0x00]));
  urlpack.decode(new Uint8Array([0xcb, 0x3f, 0xf3, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33]));
  urlpack.decode(new Uint8Array([0xcb, 0x3f, 0xf5, 0x64, 0x5a, 0x1c, 0xac, 0x08, 0x31]));
})
.add('decode float - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0xca, 0x3f, 0x00, 0x00, 0x00]));
  msgpack.decode(new Uint8Array([0xcb, 0x3f, 0xf3, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33]));
  msgpack.decode(new Uint8Array([0xcb, 0x3f, 0xf5, 0x64, 0x5a, 0x1c, 0xac, 0x08, 0x31]));
})
.add('decode float - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0xca, 0x3f, 0x00, 0x00, 0x00]));
  msgpack5.decode(new Uint8Array([0xcb, 0x3f, 0xf3, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33]));
  msgpack5.decode(new Uint8Array([0xcb, 0x3f, 0xf5, 0x64, 0x5a, 0x1c, 0xac, 0x08, 0x31]));
})
.add('decode float - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0xca, 0x3f, 0x00, 0x00, 0x00]));
  msgpackLite.decode(new Uint8Array([0xcb, 0x3f, 0xf3, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33]));
  msgpackLite.decode(new Uint8Array([0xcb, 0x3f, 0xf5, 0x64, 0x5a, 0x1c, 0xac, 0x08, 0x31]));
})
.add('decode float - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0xca, 0x3f, 0x00, 0x00, 0x00]));
  msgpackr.decode(new Uint8Array([0xcb, 0x3f, 0xf3, 0x33, 0x33, 0x33, 0x33, 0x33, 0x33]));
  msgpackr.decode(new Uint8Array([0xcb, 0x3f, 0xf5, 0x64, 0x5a, 0x1c, 0xac, 0x08, 0x31]));
})
.add('decode str - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]));
  urlpack.decode(new Uint8Array([0xda, 0x01, 0x27, 0x4c, 0x6f, 0x72, 0x65, 0x6d, 0x20, 0x69, 0x70, 0x73, 0x75, 0x6d, 0x20, 0x64, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x63, 0x74, 0x65, 0x74, 0x75, 0x72, 0x20, 0x61, 0x64, 0x69, 0x70, 0x69, 0x73, 0x63, 0x69, 0x6e, 0x67, 0x20, 0x65, 0x6c, 0x69, 0x74, 0x2e, 0x20, 0x4d, 0x61, 0x75, 0x72, 0x69, 0x73, 0x20, 0x6d, 0x6f, 0x6c, 0x65, 0x73, 0x74, 0x69, 0x65, 0x2c, 0x20, 0x73, 0x65, 0x6d, 0x20, 0x73, 0x65, 0x64, 0x20, 0x72, 0x75, 0x74, 0x72, 0x75, 0x6d, 0x20, 0x65, 0x75, 0x69, 0x73, 0x6d, 0x6f, 0x64, 0x2c, 0x20, 0x6c, 0x65, 0x6f, 0x20, 0x74, 0x65, 0x6c, 0x6c, 0x75, 0x73, 0x20, 0x6d, 0x61, 0x74, 0x74, 0x69, 0x73, 0x20, 0x76, 0x65, 0x6c, 0x69, 0x74, 0x2c, 0x20, 0x6e, 0x65, 0x63, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x71, 0x75, 0x61, 0x74, 0x20, 0x6c, 0x61, 0x63, 0x75, 0x73, 0x20, 0x6d, 0x69, 0x20, 0x71, 0x75, 0x69, 0x73, 0x20, 0x61, 0x72, 0x63, 0x75, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x75, 0x72, 0x6e, 0x61, 0x20, 0x73, 0x65, 0x6d, 0x2e, 0x20, 0x53, 0x65, 0x64, 0x20, 0x6e, 0x75, 0x6c, 0x6c, 0x61, 0x20, 0x65, 0x78, 0x2c, 0x20, 0x6d, 0x61, 0x78, 0x69, 0x6d, 0x75, 0x73, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x6f, 0x72, 0x6e, 0x61, 0x72, 0x65, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x74, 0x72, 0x69, 0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x20, 0x61, 0x74, 0x20, 0x64, 0x69, 0x61, 0x6d, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x76, 0x69, 0x76, 0x65, 0x72, 0x72, 0x61, 0x20, 0x66, 0x65, 0x75, 0x67, 0x69, 0x61, 0x74, 0x20, 0x74, 0x75, 0x72, 0x70, 0x69, 0x73, 0x2c, 0x20, 0x61, 0x63, 0x20, 0x76, 0x61, 0x72, 0x69, 0x75, 0x73, 0x20, 0x64, 0x75, 0x69, 0x20, 0x6d, 0x6f, 0x6c, 0x6c, 0x69, 0x73, 0x20, 0x75, 0x74, 0x2e]));
})
.add('decode str - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]));
  msgpack.decode(new Uint8Array([0xda, 0x01, 0x27, 0x4c, 0x6f, 0x72, 0x65, 0x6d, 0x20, 0x69, 0x70, 0x73, 0x75, 0x6d, 0x20, 0x64, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x63, 0x74, 0x65, 0x74, 0x75, 0x72, 0x20, 0x61, 0x64, 0x69, 0x70, 0x69, 0x73, 0x63, 0x69, 0x6e, 0x67, 0x20, 0x65, 0x6c, 0x69, 0x74, 0x2e, 0x20, 0x4d, 0x61, 0x75, 0x72, 0x69, 0x73, 0x20, 0x6d, 0x6f, 0x6c, 0x65, 0x73, 0x74, 0x69, 0x65, 0x2c, 0x20, 0x73, 0x65, 0x6d, 0x20, 0x73, 0x65, 0x64, 0x20, 0x72, 0x75, 0x74, 0x72, 0x75, 0x6d, 0x20, 0x65, 0x75, 0x69, 0x73, 0x6d, 0x6f, 0x64, 0x2c, 0x20, 0x6c, 0x65, 0x6f, 0x20, 0x74, 0x65, 0x6c, 0x6c, 0x75, 0x73, 0x20, 0x6d, 0x61, 0x74, 0x74, 0x69, 0x73, 0x20, 0x76, 0x65, 0x6c, 0x69, 0x74, 0x2c, 0x20, 0x6e, 0x65, 0x63, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x71, 0x75, 0x61, 0x74, 0x20, 0x6c, 0x61, 0x63, 0x75, 0x73, 0x20, 0x6d, 0x69, 0x20, 0x71, 0x75, 0x69, 0x73, 0x20, 0x61, 0x72, 0x63, 0x75, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x75, 0x72, 0x6e, 0x61, 0x20, 0x73, 0x65, 0x6d, 0x2e, 0x20, 0x53, 0x65, 0x64, 0x20, 0x6e, 0x75, 0x6c, 0x6c, 0x61, 0x20, 0x65, 0x78, 0x2c, 0x20, 0x6d, 0x61, 0x78, 0x69, 0x6d, 0x75, 0x73, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x6f, 0x72, 0x6e, 0x61, 0x72, 0x65, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x74, 0x72, 0x69, 0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x20, 0x61, 0x74, 0x20, 0x64, 0x69, 0x61, 0x6d, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x76, 0x69, 0x76, 0x65, 0x72, 0x72, 0x61, 0x20, 0x66, 0x65, 0x75, 0x67, 0x69, 0x61, 0x74, 0x20, 0x74, 0x75, 0x72, 0x70, 0x69, 0x73, 0x2c, 0x20, 0x61, 0x63, 0x20, 0x76, 0x61, 0x72, 0x69, 0x75, 0x73, 0x20, 0x64, 0x75, 0x69, 0x20, 0x6d, 0x6f, 0x6c, 0x6c, 0x69, 0x73, 0x20, 0x75, 0x74, 0x2e]));
})
.add('decode str - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]));
  msgpack5.decode(new Uint8Array([0xda, 0x01, 0x27, 0x4c, 0x6f, 0x72, 0x65, 0x6d, 0x20, 0x69, 0x70, 0x73, 0x75, 0x6d, 0x20, 0x64, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x63, 0x74, 0x65, 0x74, 0x75, 0x72, 0x20, 0x61, 0x64, 0x69, 0x70, 0x69, 0x73, 0x63, 0x69, 0x6e, 0x67, 0x20, 0x65, 0x6c, 0x69, 0x74, 0x2e, 0x20, 0x4d, 0x61, 0x75, 0x72, 0x69, 0x73, 0x20, 0x6d, 0x6f, 0x6c, 0x65, 0x73, 0x74, 0x69, 0x65, 0x2c, 0x20, 0x73, 0x65, 0x6d, 0x20, 0x73, 0x65, 0x64, 0x20, 0x72, 0x75, 0x74, 0x72, 0x75, 0x6d, 0x20, 0x65, 0x75, 0x69, 0x73, 0x6d, 0x6f, 0x64, 0x2c, 0x20, 0x6c, 0x65, 0x6f, 0x20, 0x74, 0x65, 0x6c, 0x6c, 0x75, 0x73, 0x20, 0x6d, 0x61, 0x74, 0x74, 0x69, 0x73, 0x20, 0x76, 0x65, 0x6c, 0x69, 0x74, 0x2c, 0x20, 0x6e, 0x65, 0x63, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x71, 0x75, 0x61, 0x74, 0x20, 0x6c, 0x61, 0x63, 0x75, 0x73, 0x20, 0x6d, 0x69, 0x20, 0x71, 0x75, 0x69, 0x73, 0x20, 0x61, 0x72, 0x63, 0x75, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x75, 0x72, 0x6e, 0x61, 0x20, 0x73, 0x65, 0x6d, 0x2e, 0x20, 0x53, 0x65, 0x64, 0x20, 0x6e, 0x75, 0x6c, 0x6c, 0x61, 0x20, 0x65, 0x78, 0x2c, 0x20, 0x6d, 0x61, 0x78, 0x69, 0x6d, 0x75, 0x73, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x6f, 0x72, 0x6e, 0x61, 0x72, 0x65, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x74, 0x72, 0x69, 0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x20, 0x61, 0x74, 0x20, 0x64, 0x69, 0x61, 0x6d, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x76, 0x69, 0x76, 0x65, 0x72, 0x72, 0x61, 0x20, 0x66, 0x65, 0x75, 0x67, 0x69, 0x61, 0x74, 0x20, 0x74, 0x75, 0x72, 0x70, 0x69, 0x73, 0x2c, 0x20, 0x61, 0x63, 0x20, 0x76, 0x61, 0x72, 0x69, 0x75, 0x73, 0x20, 0x64, 0x75, 0x69, 0x20, 0x6d, 0x6f, 0x6c, 0x6c, 0x69, 0x73, 0x20, 0x75, 0x74, 0x2e]));
})
.add('decode str - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]));
  msgpackLite.decode(new Uint8Array([0xda, 0x01, 0x27, 0x4c, 0x6f, 0x72, 0x65, 0x6d, 0x20, 0x69, 0x70, 0x73, 0x75, 0x6d, 0x20, 0x64, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x63, 0x74, 0x65, 0x74, 0x75, 0x72, 0x20, 0x61, 0x64, 0x69, 0x70, 0x69, 0x73, 0x63, 0x69, 0x6e, 0x67, 0x20, 0x65, 0x6c, 0x69, 0x74, 0x2e, 0x20, 0x4d, 0x61, 0x75, 0x72, 0x69, 0x73, 0x20, 0x6d, 0x6f, 0x6c, 0x65, 0x73, 0x74, 0x69, 0x65, 0x2c, 0x20, 0x73, 0x65, 0x6d, 0x20, 0x73, 0x65, 0x64, 0x20, 0x72, 0x75, 0x74, 0x72, 0x75, 0x6d, 0x20, 0x65, 0x75, 0x69, 0x73, 0x6d, 0x6f, 0x64, 0x2c, 0x20, 0x6c, 0x65, 0x6f, 0x20, 0x74, 0x65, 0x6c, 0x6c, 0x75, 0x73, 0x20, 0x6d, 0x61, 0x74, 0x74, 0x69, 0x73, 0x20, 0x76, 0x65, 0x6c, 0x69, 0x74, 0x2c, 0x20, 0x6e, 0x65, 0x63, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x71, 0x75, 0x61, 0x74, 0x20, 0x6c, 0x61, 0x63, 0x75, 0x73, 0x20, 0x6d, 0x69, 0x20, 0x71, 0x75, 0x69, 0x73, 0x20, 0x61, 0x72, 0x63, 0x75, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x75, 0x72, 0x6e, 0x61, 0x20, 0x73, 0x65, 0x6d, 0x2e, 0x20, 0x53, 0x65, 0x64, 0x20, 0x6e, 0x75, 0x6c, 0x6c, 0x61, 0x20, 0x65, 0x78, 0x2c, 0x20, 0x6d, 0x61, 0x78, 0x69, 0x6d, 0x75, 0x73, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x6f, 0x72, 0x6e, 0x61, 0x72, 0x65, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x74, 0x72, 0x69, 0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x20, 0x61, 0x74, 0x20, 0x64, 0x69, 0x61, 0x6d, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x76, 0x69, 0x76, 0x65, 0x72, 0x72, 0x61, 0x20, 0x66, 0x65, 0x75, 0x67, 0x69, 0x61, 0x74, 0x20, 0x74, 0x75, 0x72, 0x70, 0x69, 0x73, 0x2c, 0x20, 0x61, 0x63, 0x20, 0x76, 0x61, 0x72, 0x69, 0x75, 0x73, 0x20, 0x64, 0x75, 0x69, 0x20, 0x6d, 0x6f, 0x6c, 0x6c, 0x69, 0x73, 0x20, 0x75, 0x74, 0x2e]));
})
.add('decode str - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0xac, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21]));
  msgpackr.decode(new Uint8Array([0xda, 0x01, 0x27, 0x4c, 0x6f, 0x72, 0x65, 0x6d, 0x20, 0x69, 0x70, 0x73, 0x75, 0x6d, 0x20, 0x64, 0x6f, 0x6c, 0x6f, 0x72, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x63, 0x74, 0x65, 0x74, 0x75, 0x72, 0x20, 0x61, 0x64, 0x69, 0x70, 0x69, 0x73, 0x63, 0x69, 0x6e, 0x67, 0x20, 0x65, 0x6c, 0x69, 0x74, 0x2e, 0x20, 0x4d, 0x61, 0x75, 0x72, 0x69, 0x73, 0x20, 0x6d, 0x6f, 0x6c, 0x65, 0x73, 0x74, 0x69, 0x65, 0x2c, 0x20, 0x73, 0x65, 0x6d, 0x20, 0x73, 0x65, 0x64, 0x20, 0x72, 0x75, 0x74, 0x72, 0x75, 0x6d, 0x20, 0x65, 0x75, 0x69, 0x73, 0x6d, 0x6f, 0x64, 0x2c, 0x20, 0x6c, 0x65, 0x6f, 0x20, 0x74, 0x65, 0x6c, 0x6c, 0x75, 0x73, 0x20, 0x6d, 0x61, 0x74, 0x74, 0x69, 0x73, 0x20, 0x76, 0x65, 0x6c, 0x69, 0x74, 0x2c, 0x20, 0x6e, 0x65, 0x63, 0x20, 0x63, 0x6f, 0x6e, 0x73, 0x65, 0x71, 0x75, 0x61, 0x74, 0x20, 0x6c, 0x61, 0x63, 0x75, 0x73, 0x20, 0x6d, 0x69, 0x20, 0x71, 0x75, 0x69, 0x73, 0x20, 0x61, 0x72, 0x63, 0x75, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x75, 0x72, 0x6e, 0x61, 0x20, 0x73, 0x65, 0x6d, 0x2e, 0x20, 0x53, 0x65, 0x64, 0x20, 0x6e, 0x75, 0x6c, 0x6c, 0x61, 0x20, 0x65, 0x78, 0x2c, 0x20, 0x6d, 0x61, 0x78, 0x69, 0x6d, 0x75, 0x73, 0x20, 0x65, 0x67, 0x65, 0x74, 0x20, 0x6f, 0x72, 0x6e, 0x61, 0x72, 0x65, 0x20, 0x73, 0x69, 0x74, 0x20, 0x61, 0x6d, 0x65, 0x74, 0x2c, 0x20, 0x74, 0x72, 0x69, 0x73, 0x74, 0x69, 0x71, 0x75, 0x65, 0x20, 0x61, 0x74, 0x20, 0x64, 0x69, 0x61, 0x6d, 0x2e, 0x20, 0x45, 0x74, 0x69, 0x61, 0x6d, 0x20, 0x76, 0x69, 0x76, 0x65, 0x72, 0x72, 0x61, 0x20, 0x66, 0x65, 0x75, 0x67, 0x69, 0x61, 0x74, 0x20, 0x74, 0x75, 0x72, 0x70, 0x69, 0x73, 0x2c, 0x20, 0x61, 0x63, 0x20, 0x76, 0x61, 0x72, 0x69, 0x75, 0x73, 0x20, 0x64, 0x75, 0x69, 0x20, 0x6d, 0x6f, 0x6c, 0x6c, 0x69, 0x73, 0x20, 0x75, 0x74, 0x2e]));
})
.add('decode bin - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0xc4, 0xff, ...Array(2**8 - 1).fill(0).map((_, idx) => idx % 256)]));
})
.add('decode bin - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0xc4, 0xff, ...Array(2**8 - 1).fill(0).map((_, idx) => idx % 256)]));
})
.add('decode bin - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0xc4, 0xff, ...Array(2**8 - 1).fill(0).map((_, idx) => idx % 256)]));
})
.add('decode bin - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0xc4, 0xff, ...Array(2**8 - 1).fill(0).map((_, idx) => idx % 256)]));
})
.add('decode bin - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0xc4, 0xff, ...Array(2**8 - 1).fill(0).map((_, idx) => idx % 256)]));
})
.add('decode fixarray - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0x95, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0]));
})
.add('decode fixarray - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0x95, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0]));
})
.add('decode fixarray - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0x95, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0]));
})
.add('decode fixarray - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0x95, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0]));
})
.add('decode fixarray - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0x95, 0xc0, 0xc0, 0xc0, 0xc0, 0xc0]));
})
.add('decode array 8 - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0xdc, 0x01, 0x00, ...Array(2**8).fill(null)]));
})
.add('decode array 8 - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0xdc, 0x01, 0x00, ...Array(2**8).fill(null)]));
})
.add('decode array 8 - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0xdc, 0x01, 0x00, ...Array(2**8).fill(null)]));
})
.add('decode array 8 - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0xdc, 0x01, 0x00, ...Array(2**8).fill(null)]));
})
.add('decode array 8 - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0xdc, 0x01, 0x00, ...Array(2**8).fill(null)]));
})
.add('decode fixmap - @urlpack/msgpack', () => {
  urlpack.decode(new Uint8Array([0x85, 0xa1, 0x61, 0xc0, 0xa1, 0x62, 0xc0, 0xa1, 0x63, 0xc0, 0xa1, 0x64, 0xc0, 0xa1, 0x65, 0xc0]));
})
.add('decode fixmap - @msgpack/msgpack', () => {
  msgpack.decode(new Uint8Array([0x85, 0xa1, 0x61, 0xc0, 0xa1, 0x62, 0xc0, 0xa1, 0x63, 0xc0, 0xa1, 0x64, 0xc0, 0xa1, 0x65, 0xc0]));
})
.add('decode fixmap - msgpack5', () => {
  msgpack5.decode(new Uint8Array([0x85, 0xa1, 0x61, 0xc0, 0xa1, 0x62, 0xc0, 0xa1, 0x63, 0xc0, 0xa1, 0x64, 0xc0, 0xa1, 0x65, 0xc0]));
})
.add('decode fixmap - msgpack-lite', () => {
  msgpackLite.decode(new Uint8Array([0x85, 0xa1, 0x61, 0xc0, 0xa1, 0x62, 0xc0, 0xa1, 0x63, 0xc0, 0xa1, 0x64, 0xc0, 0xa1, 0x65, 0xc0]));
})
.add('decode fixmap - msgpackr', () => {
  msgpackr.decode(new Uint8Array([0x85, 0xa1, 0x61, 0xc0, 0xa1, 0x62, 0xc0, 0xa1, 0x63, 0xc0, 0xa1, 0x64, 0xc0, 0xa1, 0x65, 0xc0]));
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
