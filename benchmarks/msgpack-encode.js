import { bench, group, summary, run } from 'mitata';

import { makeMessagePackEncoder } from '@urlpack/msgpack';
const urlpack = makeMessagePackEncoder();

import msgpack from '@msgpack/msgpack';

import _msgpack5 from 'msgpack5'
const msgpack5 = _msgpack5();

import msgpackLite from 'msgpack-lite';

import * as msgpackr from 'msgpackr';

group('encode misc', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode(0);
      urlpack.encode(null);
      urlpack.encode(true);
      urlpack.encode(false);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode(0);
      msgpack.encode(null);
      msgpack.encode(true);
      msgpack.encode(false);
    });
    bench('msgpack5', () => {
      msgpack5.encode(0);
      msgpack5.encode(null);
      msgpack5.encode(true);
      msgpack5.encode(false);
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode(0);
      msgpackLite.encode(null);
      msgpackLite.encode(true);
      msgpackLite.encode(false);
    });
    bench('msgpackr', () => {
      msgpackr.encode(0);
      msgpackr.encode(null);
      msgpackr.encode(true);
      msgpackr.encode(false);
    });
  });
});

group('positive int', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode(1);
      urlpack.encode(256);
      urlpack.encode(65536);
      urlpack.encode(4294967296);
      urlpack.encode(9007199254740991);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode(1);
      msgpack.encode(256);
      msgpack.encode(65536);
      msgpack.encode(4294967296);
      msgpack.encode(9007199254740991);
    });
    bench('msgpack5', () => {
      msgpack5.encode(1);
      msgpack5.encode(256);
      msgpack5.encode(65536);
      msgpack5.encode(4294967296);
      msgpack5.encode(9007199254740991);
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode(1);
      msgpackLite.encode(256);
      msgpackLite.encode(65536);
      msgpackLite.encode(4294967296);
      msgpackLite.encode(9007199254740991);
    });
    bench('msgpackr', () => {
      msgpackr.encode(1);
      msgpackr.encode(256);
      msgpackr.encode(65536);
      msgpackr.encode(4294967296);
      msgpackr.encode(9007199254740991);
    });
  });
});

group('negative int', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode(-1);
      urlpack.encode(-256);
      urlpack.encode(-65536);
      urlpack.encode(-4294967296);
      urlpack.encode(-9007199254740991);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode(-1);
      msgpack.encode(-256);
      msgpack.encode(-65536);
      msgpack.encode(-4294967296);
      msgpack.encode(-9007199254740991);
    });
    bench('msgpack5', () => {
      msgpack5.encode(-1);
      msgpack5.encode(-256);
      msgpack5.encode(-65536);
      msgpack5.encode(-4294967296);
      msgpack5.encode(-9007199254740991);
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode(-1);
      msgpackLite.encode(-256);
      msgpackLite.encode(-65536);
      msgpackLite.encode(-4294967296);
      msgpackLite.encode(-9007199254740991);
    });
    bench('msgpackr', () => {
      msgpackr.encode(-1);
      msgpackr.encode(-256);
      msgpackr.encode(-65536);
      msgpackr.encode(-4294967296);
      msgpackr.encode(-9007199254740991);
    });
  });
});

group('encode float', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode(0.5);
      urlpack.encode(1.2);
      urlpack.encode(1.337);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode(0.5);
      msgpack.encode(1.2);
      msgpack.encode(1.337);
    });
    bench('msgpack5', () => {
      msgpack5.encode(0.5);
      msgpack5.encode(1.2);
      msgpack5.encode(1.337);
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode(0.5);
      msgpackLite.encode(1.2);
      msgpackLite.encode(1.337);
    });
    bench('msgpackr', () => {
      msgpackr.encode(0.5);
      msgpackr.encode(1.2);
      msgpackr.encode(1.337);
    });
  });
});

group('encode str', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode('Hello World!');
      urlpack.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode('Hello World!');
      msgpack.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
    });
    bench('msgpack5', () => {
      msgpack5.encode('Hello World!');
      msgpack5.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode('Hello World!');
      msgpackLite.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
    });
    bench('msgpackr', () => {
      msgpackr.encode('Hello World!');
      msgpackr.encode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie, sem sed rutrum euismod, leo tellus mattis velit, nec consequat lacus mi quis arcu. Etiam eget urna sem. Sed nulla ex, maximus eget ornare sit amet, tristique at diam. Etiam viverra feugiat turpis, ac varius dui mollis ut.');
    });
  });
});

group('encode binary', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
      urlpack.encode(bin8);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
      msgpack.encode(bin8);
    });
    bench('msgpack5', () => {
      const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
      msgpack5.encode(bin8);
    });
    bench('msgpack-lite', () => {
      const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
      msgpackLite.encode(bin8);
    });
    bench('msgpackr', () => {
      const bin8 = new Uint8Array(Array(2**8 - 1).fill(0).map((_, idx) => idx % 256));
      msgpackr.encode(bin8);
    });
  });
});

group('encode fixarray', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode([null, null, null, null, null]);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode([null, null, null, null, null]);
    });
    bench('msgpack5', () => {
      msgpack5.encode([null, null, null, null, null]);
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode([null, null, null, null, null]);
    });
    bench('msgpackr', () => {
      msgpackr.encode([null, null, null, null, null]);
    });
  });
});

group('encode array 8', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      const arr = Array(2**8 - 1).fill(null);
      urlpack.encode(arr);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      const arr = Array(2**8 - 1).fill(null);
      msgpack.encode(arr);
    });
    bench('msgpack5', () => {
      const arr = Array(2**8 - 1).fill(null);
      msgpack5.encode(arr);
    });
    bench('msgpack-lite', () => {
      const arr = Array(2**8 - 1).fill(null);
      msgpackLite.encode(arr);
    });
    bench('msgpackr', () => {
      const arr = Array(2**8 - 1).fill(null);
      msgpackr.encode(arr);
    });
  });
});

group('encode array 16', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      const arr = Array(2**16 - 1).fill(null);
      urlpack.encode(arr);
    }).baseline();
    bench('@msgpack/msgpack', () => {
      const arr = Array(2**16 - 1).fill(null);
      msgpack.encode(arr);
    });
    bench('msgpack5', () => {
      const arr = Array(2**16 - 1).fill(null);
      msgpack5.encode(arr);
    });
    bench('msgpack-lite', () => {
      const arr = Array(2**16 - 1).fill(null);
      msgpackLite.encode(arr);
    });
    bench('msgpackr', () => {
      const arr = Array(2**16 - 1).fill(null);
      msgpackr.encode(arr);
    });
  });
});

group('encode fixmap', () => {
  summary(() => {
    bench('@urlpack/msgpack', () => {
      urlpack.encode({ a: null, b: null, c: null, d: null, e: null });
    }).baseline();
    bench('@msgpack/msgpack', () => {
      msgpack.encode({ a: null, b: null, c: null, d: null, e: null });
    });
    bench('msgpack5', () => {
      msgpack5.encode({ a: null, b: null, c: null, d: null, e: null });
    });
    bench('msgpack-lite', () => {
      msgpackLite.encode({ a: null, b: null, c: null, d: null, e: null });
    });
    bench('msgpackr', () => {
      msgpackr.encode({ a: null, b: null, c: null, d: null, e: null });
    });
  });
});

run();
