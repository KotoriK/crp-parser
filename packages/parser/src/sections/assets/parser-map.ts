import parseImage from "./structs/Colossalframework.Importers.Image.js"
import type { MapMetaDataKnownRecord } from "./structs/MapMetaData.js"
import type { SaveGameMetaDataKnownRecord } from "./structs/SaveGameMetaData.js"
import { ScenarioMetaDataKnownRecord } from "./structs/ScenarioMetaData.js"
import parseMeta from './structs/_metadata.js'

/** A function that parses asset data from a Uint8Array. */
type AssetParser<T> = (data: Uint8Array) => T

/**
 * A map of asset type class names to their corresponding parser functions.
 */
export type ParserMap = Record<string, AssetParser<any>>
type MergeReturnType<F extends (buf: Uint8Array) => Record<string, any>, T extends Record<string, any>> = (...args: Parameters<F>) => T & ReturnType<F>

/**
 * Default parser map containing all known asset type parsers.
 *
 * Supported asset types:
 * - `ColossalFramework.Importers.Image` - Parses texture/image assets
 * - `SaveGameMetaData` - Parses save game metadata
 * - `MapMetaData` - Parses map metadata
 * - `ScenarioMetaData` - Parses scenario metadata
 * - `CustomAssetMetaData` - Parses custom asset metadata
 * - `BuildingInfoGen` - Parses building info
 *
 * @example
 * ```typescript
 * import { CRAP, ALL_KNOWN_PARSER_MAP } from '@kotorik/crp-parser';
 *
 * const crap = new CRAP(buffer, ALL_KNOWN_PARSER_MAP);
 * ```
 */
export const ALL_KNOWN_PARSER_MAP = {
    "ColossalFramework.Importers.Image": parseImage,
    "SaveGameMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<SaveGameMetaDataKnownRecord>>,
    "MapMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<MapMetaDataKnownRecord>>,
    "ScenarioMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<ScenarioMetaDataKnownRecord>>,
    "CustomAssetMetaData": parseMeta,
    "BuildingInfoGen": parseMeta,
} satisfies ParserMap

/** Union type of all available parser names in the default parser map. */
export type AllAvailParserName = keyof typeof ALL_KNOWN_PARSER_MAP
