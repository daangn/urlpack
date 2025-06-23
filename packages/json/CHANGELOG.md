# @urlpack/json

## 2.0.1

### Patch Changes

- bfd0528: Add extensions TypeScript's for "NodeNext" resolution.
- Updated dependencies [bfd0528]
  - @urlpack/base58@2.0.1
  - @urlpack/msgpack@2.0.1

## 2.0.0

### Major Changes

- ebbf3d3: Drop UMD support and change to ESM-first package

### Minor Changes

- 858692a: Changed the msgpack extension signature, and reimplemented decoder
- eafc5dd: Remove sideEffects assertion in all packages, to avoid unpredictable bundler issues

### Patch Changes

- 481b54b: Add `types` fields in exports
- ac16c04: Fix to be able to override base codec properly
- Updated dependencies [858692a]
- Updated dependencies [ebbf3d3]
- Updated dependencies [b242537]
- Updated dependencies [e87d19b]
- Updated dependencies [481b54b]
- Updated dependencies [eafc5dd]
- Updated dependencies [c8ff827]
  - @urlpack/msgpack@2.0.0
  - @urlpack/base58@2.0.0

## 1.0.4

### Patch Changes

- 1d4cd8f: link dependencies using the workspace protocol, it should use "yarn npm publish" for publishing from now on
- Updated dependencies [1d4cd8f]
  - @urlpack/base58@1.0.4
