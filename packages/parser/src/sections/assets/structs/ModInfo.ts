import decodePStr from "../../../datatypes/pstr.js"
import { decodeUint32, decodeUint64BigInt } from "../../../datatypes/uint.js"
export interface ModInfo {
    name: string
    // Workshop Id
    id: bigint
}
const STUB_ID = 0xffffffffffffffffn
export default function parser(next: () => number) {
    let name = decodePStr(next)
    const id = decodeUint64BigInt(next)
    if (id !== STUB_ID) {
        const idString = id.toString(10)
        if (name.startsWith(idString)) {
            name = name.substring(idString.length + 1)
        }
    }
    return { name, id } as ModInfo
}