import { expectNull } from "../../datatypes/null.js"
import decodePStr from "../../datatypes/pstr.js"
import { decodeUint32 } from "../../datatypes/uint.js"
import { ModInfo, tryDecodeNetType } from "./BinaryDeserializer.js"

export interface SaveGameMetaDataKnownRecord {
    cityName: string
    timeStamp: Date,
    imageRef: string,
    steamPreviewRef: string,
    achievementsDisabled: boolean,
    mods: ModInfo[],
    assets: ModInfo[],
    environment: string,
    population: string
    cash: string
    assetRef: string
}
export default function parser(data: Uint8Array): Partial<SaveGameMetaDataKnownRecord> & Record<string, any> {
    let i = 0
    const iterator = () => {
        const next = data[i++]
        if (next === undefined) {
            throw new Error('unexpected end of data, index: ' + i)
        } else {
            return next
        }
    }
    const len = decodeUint32(iterator)
    const entries = []
    expectNull(iterator)
    const expectLen = len - 1
    for (;;) {
        const assembly = decodePStr(iterator)
        const name = decodePStr(iterator)
        const res = tryDecodeNetType(assembly, iterator)
        if (entries.push([name, res]) >= expectLen) {
            break
        }
        while (iterator() !== 0) { }
    }
    return Object.fromEntries(entries)
}