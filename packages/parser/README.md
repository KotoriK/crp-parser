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

---

# @kotorik/crp-parser (中文)

![NPM Downloads](https://img.shields.io/npm/d18m/%40kotorik%2Fcrp-parser)
![NPM License](https://img.shields.io/npm/l/%40kotorik%2Fcrp-parser)
![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40kotorik%2Fcrp-parser)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40kotorik%2Fcrp-parser)
![GitHub top language](https://img.shields.io/github/languages/top/kotorik/crp-parser)
![NPM Version](https://img.shields.io/npm/v/%40kotorik%2Fcrp-parser)

一个纯 JavaScript 实现的 [Cities: Skylines CRAP 文件格式](https://skylines.paradoxwikis.com/CRAP_File_Format) 解析器，提供完整的 TypeScript 类型定义。

## 功能特性

- 📦 解析 Cities: Skylines 的 CRAP（CRP Archive Package）文件
- 🖼️ 提取和解析纹理/图片
- 💾 解析存档元数据
- 🗺️ 解析地图和场景元数据
- 🏗️ 解析自定义资源元数据
- 📝 完整的 TypeScript 支持和类型定义
- 🚀 零依赖，纯 JavaScript 实现

## 安装

```bash
npm install @kotorik/crp-parser
```

或使用其他包管理器：

```bash
# pnpm
pnpm add @kotorik/crp-parser

# yarn
yarn add @kotorik/crp-parser
```

## 使用方法

### 基本示例

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP } from '@kotorik/crp-parser';
import { readFile } from 'node:fs/promises';

// 读取 .crp 文件
const file = await readFile('path/to/asset.crp');
const crap = new CRAP(file.buffer, ALL_KNOWN_PARSER_MAP);

// 访问包元数据
console.log('包名称:', crap.packageName);
console.log('作者:', crap.authorName);
console.log('版本:', crap.packageVersion);
console.log('主资源:', crap.mainAssetName);
console.log('文件数量:', crap.fileCount);

// 列出所有资源条目
for (const entry of crap.assetEntries) {
  console.log(`- ${entry.name} (类型: ${entry.type}, 大小: ${entry.size})`);
}
```

### 解析资源

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP, KnownAssetType } from '@kotorik/crp-parser';

const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP);

// 通过条目解析特定资源
const entry = crap.assetEntries[0];
const result = crap.parse(entry);

console.log('Assembly:', result.assembly);
console.log('名称:', result.name);
console.log('数据:', result.data);

// 检查资源是否可解析
if (crap.isParsable(0)) {
  const parsed = crap.parse(crap.assetEntries[0]);
  // 处理解析后的数据
}

// 解析所有可解析的资源
const allParsed = crap.parseAll();

// 强制解析所有资源（包括未知类型）
const allForced = crap.parseAll(true);
```

### 处理纹理

```typescript
import { CRAP, ALL_KNOWN_PARSER_MAP, KnownAssetType } from '@kotorik/crp-parser';
import { writeFile } from 'node:fs/promises';

const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP);

// 查找纹理资源
const textureEntry = crap.assetEntries.find(
  entry => entry.type === KnownAssetType.Texture
);

if (textureEntry) {
  const result = crap.parse(textureEntry);
  
  // result.data 包含 ImageImporterResult
  // 包括 forceLinear 标志和 images 数组
  if (result.parser === 'ColossalFramework.Importers.Image') {
    for (let i = 0; i < result.data.images.length; i++) {
      await writeFile(`texture_${i}.png`, result.data.images[i]);
    }
  }
}
```

### 错误处理

```typescript
// 默认情况下，错误会被捕获并作为 Error 对象返回
const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP, true);
const result = crap.parse(entry);

if (result instanceof Error) {
  console.error('解析失败:', result.message);
} else {
  // 处理成功解析的结果
}

// 如需抛出错误，将 ignoreError 设置为 false
const strictCrap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP, false);

try {
  const result = strictCrap.parse(entry);
} catch (error) {
  console.error('解析失败:', error);
}
```

### 通过引用查找资源

```typescript
// 通过校验和引用查找资源
const ref = 'some-checksum-string';
const entry = crap.solveRef(ref);

if (entry) {
  console.log('找到资源:', entry.name);
}
```

## API 参考

### `CRAP<M extends ParserMap>`

CRAP 文件的主解析类。

#### 构造函数

```typescript
new CRAP(buf: ArrayBuffer, parserMap: M, ignoreError?: boolean)
```

- `buf` - 包含 CRAP 文件数据的原始 ArrayBuffer
- `parserMap` - 资源类型名称到解析函数的映射（使用 `ALL_KNOWN_PARSER_MAP` 获取所有支持的类型）
- `ignoreError` - 如果为 true（默认），解析错误会作为 Error 对象返回而不是抛出

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `fileFormat` | `number` | CRAP 文件格式版本 |
| `packageName` | `string` | 包名称 |
| `authorName` | `string` | 包作者名称 |
| `packageVersion` | `number` | 包版本号 |
| `mainAssetName` | `string` | 主资源名称 |
| `fileCount` | `number` | 包中的资源数量 |
| `dataOffset` | `number` | 资源数据开始的字节偏移量 |
| `assetEntries` | `CRAPAssetEntry[]` | 资源条目数组 |

#### 方法

| 方法 | 描述 |
|------|------|
| `parse(entry)` | 解析单个资源条目 |
| `parseAll(force?)` | 解析所有资源（force=true 时解析未知类型） |
| `isParsable(index)` | 检查指定索引的资源是否可解析 |
| `solveRef(ref)` | 通过校验和引用查找资源条目 |

### `KnownAssetType`

CRAP 文件中已知资源类型的枚举。

### `ALL_KNOWN_PARSER_MAP`

包含所有支持的资源类型解析器的默认解析器映射。

## 许可证

[MIT](../../LICENSE)
