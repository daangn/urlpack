import { group, bench, barplot, summary, run, do_not_optimize } from 'mitata';

import { makeBaseEncoder, makeBaseDecoder } from '@urlpack/base-codec';
import baseXCodec from 'base-x';
import * as base58js from 'base58-js';

const baseAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const urlpack = {
  ...makeBaseEncoder(baseAlphabet),
  ...makeBaseDecoder(baseAlphabet),
};
const baseX = baseXCodec(baseAlphabet);

const buffer = Buffer.from(`
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
`);
const text = urlpack.encode(buffer);

group('encode', () => {
  summary(() => {
    barplot(() => {
      bench('@urlpack/base-codec encode', () => {
        do_not_optimize(
          urlpack.encode(buffer),
        );
      }).baseline();

      bench('base-x encode', () => {
        do_not_optimize(
          baseX.encode(buffer),
        );
      });

      bench('base58-js encode', () => {
        do_not_optimize(
          base58js.binary_to_base58(buffer),
        );
      });
    });
  });
});

group('decode', () => {
  summary(() => {
    barplot(() => {
      bench('@urlpack/base-codec decode', () => {
        do_not_optimize(
          urlpack.decode(text),
        );
      }).baseline();

      bench('base-x decode', () => {
        do_not_optimize(
          baseX.decode(text),
        );
      });

      bench('base58-js decode', () => {
        do_not_optimize(
          base58js.base58_to_binary(text),
        );
      });
    });
  });
});

run();
