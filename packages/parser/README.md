# @kotorik/crp-parser

![NPM Downloads](https://img.shields.io/npm/d18m/%40kotorik%2Fcrp-parser)
![NPM License](https://img.shields.io/npm/l/%40kotorik%2Fcrp-parser)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40kotorik%2Fcrp-parser)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40kotorik%2Fcrp-parser)
![GitHub top language](https://img.shields.io/github/languages/top/kotorik/crp-parser)
![NPM Version](https://img.shields.io/npm/v/%40kotorik%2Fcrp-parser)

A pure JavaScript parser for [Cities: Skylines CRAP File Format](https://skylines.paradoxwikis.com/CRAP_File_Format), with full TypeScript type definitions.

## Features

- 📦 Parse CRAP (CRP Archive Package) files from Cities: Skylines
- 🖼️ Extract and parse textures/images
- 💾 Parse save game metadata
- 🗺️ Parse map and scenario metadata
- 🏗️ Parse custom asset metadata
- 📝 Full TypeScript support with comprehensive type definitions
- 🚀 Zero dependencies, pure JavaScript implementation

## Installation

```bash
npm install @kotorik/crp-parser
```

Or with other package managers:

```bash
# pnpm
pnpm add @kotorik/crp-parser

# yarn
yarn add @kotorik/crp-parser
```

## Usage

### Basic Example

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP } from '@kotorik/crp-parser';
import { readFile } from 'node:fs/promises';

// Read a .crp file
const file = await readFile('path/to/asset.crp');
const crap = new CRAP(file.buffer, ALL_KNOWN_PARSER_MAP);

// Access package metadata
console.log('Package Name:', crap.packageName);
console.log('Author:', crap.authorName);
console.log('Version:', crap.packageVersion);
console.log('Main Asset:', crap.mainAssetName);
console.log('File Count:', crap.fileCount);

// List all asset entries
for (const entry of crap.assetEntries) {
  console.log(`- ${entry.name} (type: ${entry.type}, size: ${entry.size})`);
}
```

### Parsing Assets

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP, KnownAssetType } from '@kotorik/crp-parser';

const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP);

// Parse a specific asset by entry
const entry = crap.assetEntries[0];
const result = crap.parse(entry);

console.log('Assembly:', result.assembly);
console.log('Name:', result.name);
console.log('Data:', result.data);

// Check if an asset is parsable
if (crap.isParsable(0)) {
  const parsed = crap.parse(crap.assetEntries[0]);
  // Handle parsed data
}

// Parse all parsable assets
const allParsed = crap.parseAll();

// Force parse all assets (including unknown types)
const allForced = crap.parseAll(true);
```

### Working with Textures

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP, KnownAssetType } from '@kotorik/crp-parser';
import { writeFile } from 'node:fs/promises';

const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP);

// Find texture assets
const textureEntry = crap.assetEntries.find(
  entry => entry.type === KnownAssetType.Texture
);

if (textureEntry) {
  const result = crap.parse(textureEntry);
  
  // result.data contains ImageImporterResult
  // with forceLinear flag and images array
  if (result.parser === 'ColossalFramework.Importers.Image') {
    for (let i = 0; i < result.data.images.length; i++) {
      await writeFile(`texture_${i}.png`, result.data.images[i]);
    }
  }
}
```

### Error Handling

```typescript
// By default, errors are caught and returned as Error objects
const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP, true);
const result = crap.parse(entry);

if (result instanceof Error) {
  console.error('Parse failed:', result.message);
} else {
  // Handle successful parse
}

// To throw errors instead, set ignoreError to false
const strictCrap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP, false);

try {
  const result = strictCrap.parse(entry);
} catch (error) {
  console.error('Parse failed:', error);
}
```

### Finding Assets by Reference

```typescript
// Find an asset by its checksum reference
const ref = 'some-checksum-string';
const entry = crap.solveRef(ref);

if (entry) {
  console.log('Found asset:', entry.name);
}
```

## API Reference

### `CRAP<M extends ParserMap>`

Main parser class for CRAP files.

#### Constructor

```typescript
new CRAP(buf: ArrayBuffer, parserMap: M, ignoreError?: boolean)
```

- `buf` - Raw ArrayBuffer containing the CRAP file data
- `parserMap` - Map of asset type names to parser functions (use `ALL_KNOWN_PARSER_MAP` for all supported types)
- `ignoreError` - If true (default), parsing errors are returned as Error objects instead of throwing

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `fileFormat` | `number` | CRAP file format version |
| `packageName` | `string` | Package name |
| `authorName` | `string` | Package author name |
| `packageVersion` | `number` | Package version number |
| `mainAssetName` | `string` | Name of the main asset |
| `fileCount` | `number` | Number of assets in the package |
| `dataOffset` | `number` | Byte offset where asset data begins |
| `assetEntries` | `CRAPAssetEntry[]` | Array of asset entries |

#### Methods

| Method | Description |
|--------|-------------|
| `parse(entry)` | Parse a single asset entry |
| `parseAll(force?)` | Parse all assets (force=true to parse unknown types) |
| `isParsable(index)` | Check if asset at index is parsable |
| `solveRef(ref)` | Find asset entry by checksum reference |

### `KnownAssetType`

Enum of known asset types in CRAP files.

### `ALL_KNOWN_PARSER_MAP`

Default parser map with all supported asset type parsers.

## License

[MIT](../../LICENSE)
