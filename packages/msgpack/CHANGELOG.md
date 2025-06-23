# @urlpack/msgpack

## 2.0.1

### Patch Changes

- bfd0528: Add extensions TypeScript's for "NodeNext" resolution.

## 2.0.0

### Major Changes

- 858692a: Changed the msgpack extension signature, and reimplemented decoder
- ebbf3d3: Drop UMD support and change to ESM-first package

### Minor Changes

- eafc5dd: Remove sideEffects assertion in all packages, to avoid unpredictable bundler issues
- c8ff827: switch to ESM first

### Patch Changes

- e87d19b: Fix negative float decoding (#14)
- 481b54b: Add `types` fields in exports

## 1.0.3

### Patch Changes

- bump version (yarn 1 doesn't seems to respect publishConfig fields)

## 1.0.2

### Patch Changes

- 30a610b: fix decoding for long string on dict
- 65ec067: Make it polyfill friendly by avoiding bigint liternal syntax
