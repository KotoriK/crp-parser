import parseImage from "./structs/Colossalframework.Importers.Image.js"
import type { MapMetaDataKnownRecord } from "./structs/MapMetaData.js"
import type { SaveGameMetaDataKnownRecord } from "./structs/SaveGameMetaData.js"
import { ScenarioMetaDataKnownRecord } from "./structs/ScenarioMetaData.js"
import parseMeta from './structs/_metadata.js'
type AssetParser<T> = (data: Uint8Array) => T
export type ParserMap = Record<string, AssetParser<any>>
type MergeReturnType<F extends (buf: Uint8Array) => Record<string, any>, T extends Record<string, any>> = (...args: Parameters<F>) => T & ReturnType<F>
export const ALL_KNOWN_PARSER_MAP = {
    "ColossalFramework.Importers.Image": parseImage,
    "SaveGameMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<SaveGameMetaDataKnownRecord>>,
    "MapMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<MapMetaDataKnownRecord>>,
    "ScenarioMetaData": parseMeta as MergeReturnType<typeof parseMeta, Partial<ScenarioMetaDataKnownRecord>>,
    "CustomAssetMetaData": parseMeta,
    "BuildingInfoGen": parseMeta,
} satisfies ParserMap
export type AllAvailParserName = keyof typeof ALL_KNOWN_PARSER_MAP

