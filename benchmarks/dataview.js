const { Benchmark } = require('benchmark');

const bin = new Uint8Array(Array(10000).fill(0))
const staticView = new DataView(bin.buffer)
const staticViewOffset = new DataView(bin.buffer, 5000)

new Benchmark.Suite()
.add('direct access', () => {
  bin[5000]
})
.add('dataview from offset (static)', () => {
  staticViewOffset.getUint8(0)
})
.add('dataview from offset', () => {
  let view = new DataView(bin.buffer, 5000)
  view.getUint8(0)
})
.add('dataview get offset (static)', () => {
  staticView.getUint8(0, 5000)
})
.add('dataview get offset', () => {
  let view = new DataView(bin.buffer)
  view.getUint8(0, 5000)
})
.on('cycle', event => {
  console.log(event.target.toString());
})
.run();
