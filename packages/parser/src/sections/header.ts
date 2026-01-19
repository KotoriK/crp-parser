import type { AcquireDataFn } from "../utils.js"
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
function parseHeaderMeta(acquireData: AcquireDataFn) {
    // parse signature
    const signature = acquireData(4);
    if (signature.getUint8(0) !== 0x43 || signature.getUint8(1) !== 0x52 || signature.getUint8(2) !== 0x41 || signature.getUint8(3) !== 0x50) {
        throw new Error("Invalid signature");
    }
    // parse file format version
    const fileFormat = decodeUint16(acquireData);
    const packageName = decodePStr(acquireData);
    const authorName = decodePStr(acquireData);
    const packageVersion = decodeUint32(acquireData);
    const mainAssetName = decodePStr(acquireData);
    const fileCount = decodeUint32(acquireData);
    const dataOffset = decodeUint64(acquireData);
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

export function parseHeader(next: AcquireDataFn) {
    const headerMeta = parseHeaderMeta(next) as unknown as CRAPHeader
    const assetEntries = []
    for (let i = 0; i < headerMeta.fileCount; i++) {
        assetEntries.push(parseCRAPAssetEntry(next))
    }
    headerMeta.assetEntries = assetEntries
    return headerMeta
}