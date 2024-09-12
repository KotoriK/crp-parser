import decodePStr from "../datatypes/pstr.js"
import { decodeUint32, decodeUint64 } from "../datatypes/uint.js"
export enum KnownAssetType {
    Object = 1,
    Material = 2,
    Texture = 3,
    StaticMesh = 4,
    Text = 50,
    Assembly = 51,
    Data = 52,
    Package = 53,
    Locale = 80,
    User = 100,
    SaveGame = 101,
    CustomMap = 102,
    CustomAsset = 103,
    ColorCorrection = 104,
    DistrictStyle = 105,
    MapTheme = 106,
    MapThemeMap = 107,
    Scenario = 108,
}
export function getAssetTypeFriendlyName(type: KnownAssetType) {
    return KnownAssetType[type]
}
export interface CRAPAssetEntry {
    name: string
    checksum: string
    type: number | KnownAssetType
    offset: number
    size: number
}
export function parseCRAPAssetEntry(accuireNextByte: () => number) {
    const name = decodePStr(accuireNextByte);
    const checksum = decodePStr(accuireNextByte);
    const type = decodeUint32(accuireNextByte)
    const offset = decodeUint64(accuireNextByte);
    const size = decodeUint64(accuireNextByte);

    return {
        name,
        checksum,
        type,
        offset,
        size
    } satisfies CRAPAssetEntry
}

export function buildAssetEntryDataGetter(dataOffset: number, data: Uint8Array) {
    return (entry: CRAPAssetEntry) => {
        const start = dataOffset + entry.offset;
        return data.subarray(start, start + entry.size)
    }
}
export function isAssetParsable(type: KnownAssetType) {
    return type === KnownAssetType.Texture || type === KnownAssetType.SaveGame
}