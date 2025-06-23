import { bench, do_not_optimize, run } from 'mitata';

const bin = new Uint8Array(Array(10000).fill(0));
const staticView = new DataView(bin.buffer);
const staticViewOffset = new DataView(bin.buffer, 5000);

bench('direct access', () => {
  do_not_optimize(
    bin[5000],
  );
});

bench('dataview from offset (static)', () => {
  do_not_optimize(
    staticViewOffset.getUint8(0),
  );
});

bench('dataview from offset', () => {
  let view = new DataView(bin.buffer, 5000)
  do_not_optimize(
    view.getUint8(0),
  );
});

bench('dataview get offset (static)', () => {
  do_not_optimize(
    staticView.getUint8(0, 5000),
  );
});

bench('dataview get offset', () => {
  let view = new DataView(bin.buffer)
  do_not_optimize(
    view.getUint8(0, 5000),
  );
});

run();
