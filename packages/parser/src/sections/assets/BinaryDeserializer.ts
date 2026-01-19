import decodeBoolean from "../../datatypes/bool.js"
import decodePStr from "../../datatypes/pstr.js"
import { decodeInt32, decodeSingle, decodeUint32 } from "../../datatypes/uint.js"
import { parseClassNameFromAssemblyName } from "./utils.js"
import parseModInfo from "./structs/ModInfo.js"
import createArrayParser from "./structs/_array.js"
const MAP = {
    "System.String": decodePStr,
    "System.DateTime": (next: (count: number) => Uint8Array) => {
        const timestamp = decodePStr(next)
        return new Date(timestamp)
    },
    "System.Boolean": decodeBoolean,
    "System.UInt32": decodeUint32,
    "System.Int32": decodeInt32,
    "System.Single": decodeSingle,
    "System.Byte[]": (next: (count: number) => Uint8Array) => {
        const len = decodeUint32(next)
        return next(len)
    },
    "ColossalFramework.Packaging.Package+Asset": decodePStr,
    "ModInfo[]": createArrayParser(parseModInfo),
    "UnityEngine.Vector2": (next: (count: number) => Uint8Array) => [decodeSingle(next), decodeSingle(next)],
    "UnityEngine.Vector3": (next: (count: number) => Uint8Array) => [decodeSingle(next), decodeSingle(next), decodeSingle(next)],
    "SteamHelper+DLC_BitMask": decodeInt32,
    "VehicleInfo+VehicleType": decodeInt32,
    "CustomAssetMetaData+Type": decodeInt32,
    "ItemClass+Level": decodeInt32,
    "ItemClass+Service": decodeInt32,
    "ItemClass+SubService": decodeInt32,
} satisfies Record<string, (next: (count: number) => Uint8Array) => any>

export function tryDecodeNetType(assembly: string, acquireNewBytes: (count: number) => Uint8Array) {
    const parserClass = parseClassNameFromAssemblyName(assembly)
    if (parserClass) {
        const parser = MAP[parserClass as keyof typeof MAP]
        if (parser) {
            return parser(acquireNewBytes)
        } else if (parserClass.endsWith("[]")) {
            const baseType = parserClass.substring(0, parserClass.length - 2)
            const baseParser = MAP[baseType as keyof typeof MAP]
            if (baseParser) {
                const arrParser = (MAP as any)[parserClass] = createArrayParser(baseParser)
                return arrParser(acquireNewBytes)
            }
        }
    }
    throw new Error('unknown assembly: ' + assembly)
}
export function decodeNETBinary(data: Uint8Array) {
    let i = 0
    const iterator = (count: number): Uint8Array => {
        const result = data.subarray(i, i + count);
        i += count;
        return result;
    }
    const assembly = decodePStr(iterator)
    const name = decodePStr(iterator)
    return {
        assembly: assembly,
        name,
        data: data.subarray(i)
    }
}