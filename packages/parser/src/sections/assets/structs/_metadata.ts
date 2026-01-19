import { expectNull } from "../../../datatypes/null.js"
import decodePStr from "../../../datatypes/pstr.js"
import { decodeUint32 } from "../../../datatypes/uint.js"
import { tryDecodeNetType } from "../BinaryDeserializer.js"

export default function parser(data: Uint8Array): Record<string, any> {
    let i = 0
    const iterator = (count: number): Uint8Array => {
        if (i + count > data.length) {
            throw new Error('unexpected end of data, index: ' + i)
        }
        const result = data.subarray(i, i + count);
        i += count;
        return result;
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
        while (iterator(1)[0] !== 0) { }
    }
    return Object.fromEntries(entries)
}