import decodePStr from "../datatypes/pstr.js"
import { decodeUint16, decodeUint32, decodeUint64 } from "../datatypes/uint.js"
import { parseCRAPAssetEntry, CRAPAssetEntry } from "./assetEntry.js"

interface CRAPHeaderMeta {
    fileFormat: number
    packageName: string
    authorName: string
    packageVersion: number
    mainAssetName: string
    fileCount: number
    dataOffset: number
}
export type CRAPHeader = CRAPHeaderMeta & {
    assetEntries: CRAPAssetEntry[]
}
/**
 * 
 * @param input 
 * @see https://skylines.paradoxwikis.com/CRAP_File_Format
 */
function parseHeaderMeta(accuireNextByte: () => number) {
    // parse signature
    if (accuireNextByte() !== 0x43 || accuireNextByte() !== 0x52 || accuireNextByte() !== 0x41 || accuireNextByte() !== 0x50) {
        throw new Error("Invalid signature");
    }
    // parse file format version
    const fileFormat = decodeUint16(accuireNextByte);
    const packageName = decodePStr(accuireNextByte);
    const authorName = decodePStr(accuireNextByte);
    const packageVersion = decodeUint32(accuireNextByte);
    const mainAssetName = decodePStr(accuireNextByte);
    const fileCount = decodeUint32(accuireNextByte);
    const dataOffset = decodeUint64(accuireNextByte);
    return {
        fileFormat,
        packageName,
        authorName,
        packageVersion,
        mainAssetName,
        fileCount,
        dataOffset
    } satisfies CRAPHeaderMeta
}

export function parseHeader(next: () => number) {
    const headerMeta = parseHeaderMeta(next) as unknown as CRAPHeader
    const assetEntries = []
    for (let i = 0; i < headerMeta.fileCount; i++) {
        assetEntries.push(parseCRAPAssetEntry(next))
    }
    headerMeta.assetEntries = assetEntries
    return headerMeta
}