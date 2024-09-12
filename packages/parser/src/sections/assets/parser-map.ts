import parseImage from "./Colossalframework.Importers.Image.js"
import parseSaveGameMetaData from "./SaveGameMetaData.js"
type AssetParser<T> = (data: Uint8Array) => T
export type ParserMap = Record<string, AssetParser<any>>
export const ALL_KNOWN_PARSER_MAP = {
    "ColossalFramework.Importers.Image": parseImage,
    "SaveGameMetaData": parseSaveGameMetaData,
} satisfies ParserMap
export type AllAvailParserName = keyof typeof ALL_KNOWN_PARSER_MAP

