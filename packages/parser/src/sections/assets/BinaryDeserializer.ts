import decodeBoolean from "../../datatypes/bool.js"
import decodePStr from "../../datatypes/pstr.js"
import { decodeInt32, decodeSingle, decodeUint32 } from "../../datatypes/uint.js"
import { parseClassNameFromAssemblyName } from "./utils.js"
import parseModInfoArray from "./structs/ModInfo.js"
import createArrayParser from "./structs/_array.js"
const MAP = {
    "System.String": decodePStr,
    "System.DateTime": (next) => {
        const timestamp = decodePStr(next)
        return new Date(timestamp)
    },
    "System.Boolean": decodeBoolean,
    "System.UInt32": decodeUint32,
    "System.Int32": decodeInt32,
    "System.Single": decodeSingle,
    "System.Byte[]": next => {
        const len = decodeUint32(next)
        const buf = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            buf[i] = next()
        }
        return buf
    },
    "ColossalFramework.Packaging.Package+Asset": decodePStr,
    "ModInfo[]": createArrayParser(parseModInfoArray),
    "UnityEngine.Vector2": (next) => [decodeSingle(next), decodeSingle(next)],
    "UnityEngine.Vector3": (next) => [decodeSingle(next), decodeSingle(next), decodeSingle(next)],
    "SteamHelper+DLC_BitMask": decodeInt32,
    "VehicleInfo+VehicleType": decodeInt32,
    "CustomAssetMetaData+Type": decodeInt32,
    "ItemClass+Level": decodeInt32,
    "ItemClass+Service": decodeInt32,
    "ItemClass+SubService": decodeInt32,
} satisfies Record<string, (next: () => number) => any>

export function tryDecodeNetType(assembly: string, accuireNextByte: () => number) {
    const parserClass = parseClassNameFromAssemblyName(assembly)
    if (parserClass) {
        const parser = MAP[parserClass as keyof typeof MAP]
        if (parser) {
            return parser(accuireNextByte)
        } else if (parserClass.endsWith("[]")) {
            const baseType = parserClass.substring(0, parserClass.length - 2)
            const baseParser = MAP[baseType as keyof typeof MAP]
            if (baseParser) {
                const arrParser = (MAP as any)[parserClass] = createArrayParser(baseParser)
                return arrParser(accuireNextByte)
            }
        }
    }
    throw new Error('unknown assembly: ' + assembly)
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