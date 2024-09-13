import { decodeUint32 } from "../../../datatypes/uint.js"

export default function createArrayParser<T extends (next: () => number) => any>(baseTypeParser: T) {
    return function arrayParser(next: () => number) {
        const len = decodeUint32(next)
        const res = [] as ReturnType<T>[]
        for (let i = 0; i < len; i++) {
            res.push(baseTypeParser(next))
        }
        return res
    }
}