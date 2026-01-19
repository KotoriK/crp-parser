import type { AcquireDataFn } from "../utils.js"
import decodePStr from "../datatypes/pstr.js"
import { decodeUint32, decodeUint64 } from "../datatypes/uint.js"

/**
 * Known asset types in Cities: Skylines CRAP files.
 *
 * @see https://skylines.paradoxwikis.com/CRAP_File_Format
 */
export enum KnownAssetType {
    /** 3D object asset. */
    Object = 1,
    /** Material definition asset. */
    Material = 2,
    /** Texture asset (parsable). */
    Texture = 3,
    /** Static mesh asset. */
    StaticMesh = 4,
    /** Text resource asset. */
    Text = 50,
    /** Compiled assembly asset. */
    Assembly = 51,
    /** Generic data asset. */
    Data = 52,
    /** Package asset. */
    Package = 53,
    /** Localization asset. */
    Locale = 80,
    /** User-related asset. */
    User = 100,
    /** Save game asset (parsable). */
    SaveGame = 101,
    /** Custom map asset. */
    CustomMap = 102,
    /** Custom asset. */
    CustomAsset = 103,
    /** Color correction LUT asset. */
    ColorCorrection = 104,
    /** District style asset. */
    DistrictStyle = 105,
    /** Map theme asset. */
    MapTheme = 106,
    /** Map theme map asset. */
    MapThemeMap = 107,
    /** Scenario asset. */
    Scenario = 108,
}

/**
 * Represents an asset entry in a CRAP file.
 * Contains metadata about a single asset within the package.
 */
export interface CRAPAssetEntry {
    /** Asset name. */
    name: string
    /** Checksum string used as a reference identifier. */
    checksum: string
    /** Asset type (see {@link KnownAssetType} for known values). */
    type: number | KnownAssetType
    /** Byte offset of the asset data relative to the data section start. */
    offset: number
    /** Size of the asset data in bytes. */
    size: number
}
export function parseCRAPAssetEntry(acquireData: AcquireDataFn) {
    const name = decodePStr(acquireData);
    const checksum = decodePStr(acquireData);
    const type = decodeUint32(acquireData)
    const offset = decodeUint64(acquireData);
    const size = decodeUint64(acquireData);

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