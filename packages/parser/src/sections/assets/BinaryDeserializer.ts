import decodeBoolean from "../../datatypes/bool.js"
import decodePStr from "../../datatypes/pstr.js"
import { decodeUint32, decodeUint64BigInt } from "../../datatypes/uint.js"
import { parseClassNameFromAssemblyName } from "./utils.js"
export interface ModInfo {
    name: string
    id: bigint
}
const MAP = {
    "System.Boolean": decodeBoolean,
    "System.String": decodePStr,
    "System.DateTime": (next) => {
        const timestamp = decodePStr(next)
        return new Date(timestamp)
    },
    "ColossalFramework.Packaging.Package+Asset": decodePStr,
    "ModInfo[]": (next) => {
        const res = [] as ModInfo[]
        const len = decodeUint32(next)
        for (let i = 0; i < len; i++) {
            let name = decodePStr(next)
            const id = decodeUint64BigInt(next)
            const idString = id.toString(10)
            if (name.startsWith(idString)) {
                name = name.substring(idString.length + 1)
            }

            res.push({ name, id })
        }
        return res
    }
} satisfies Record<string, (next: () => number) => any>

export function tryDecodeNetType<T extends string>(assembly: T, accuireNextByte: () => number): T extends keyof typeof MAP ? ReturnType<typeof MAP[T]> : Uint8Array {
    const parserClass = parseClassNameFromAssemblyName(assembly)
    const parser = MAP[parserClass]
    if (parser) {
        return parser(accuireNextByte)
    } else {
        throw new Error('unknown assembly' + assembly)
    }
}
export function decodeNETBinary(data: Uint8Array) {
    let i = 0
    const iterator = () => data[i++]
    const assembly = decodePStr(iterator)
    const name = decodePStr(iterator)
    return {
        assembly: assembly,
        name,
        data: data.subarray(i)
    }
}