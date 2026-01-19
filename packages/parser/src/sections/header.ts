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
function parseHeaderMeta(acquireNewBytes: (count: number) => Uint8Array) {
    // parse signature
    const signature = acquireNewBytes(4);
    if (signature[0] !== 0x43 || signature[1] !== 0x52 || signature[2] !== 0x41 || signature[3] !== 0x50) {
        throw new Error("Invalid signature");
    }
    // parse file format version
    const fileFormat = decodeUint16(acquireNewBytes);
    const packageName = decodePStr(acquireNewBytes);
    const authorName = decodePStr(acquireNewBytes);
    const packageVersion = decodeUint32(acquireNewBytes);
    const mainAssetName = decodePStr(acquireNewBytes);
    const fileCount = decodeUint32(acquireNewBytes);
    const dataOffset = decodeUint64(acquireNewBytes);
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

export function parseHeader(next: (count: number) => Uint8Array) {
    const headerMeta = parseHeaderMeta(next) as unknown as CRAPHeader
    const assetEntries = []
    for (let i = 0; i < headerMeta.fileCount; i++) {
        assetEntries.push(parseCRAPAssetEntry(next))
    }
    headerMeta.assetEntries = assetEntries
    return headerMeta
}