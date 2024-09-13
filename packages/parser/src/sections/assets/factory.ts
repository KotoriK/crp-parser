import { expectEqualZero } from "../../datatypes/null.js";
import { decodeNETBinary } from "./BinaryDeserializer.js";
import { type ParserMap } from "./parser-map.js";
import { parseClassNameFromAssemblyName } from "./utils.js";

export default function createAssetDataParser<M extends ParserMap>(map: M) {
    type AvailParserName = keyof M

    type AssetParseResult<P extends AvailParserName | undefined> = (P extends AvailParserName ? {
        parser: P
        data: ReturnType<M[P]>
    } : {
        parser?: undefined
        data: Uint8Array
    }) & {
        assembly: string
        name: string
    }

    return (assetData: Uint8Array) => {
        expectEqualZero(assetData[0])
        const { assembly, name, data } = decodeNETBinary(assetData.subarray(1))
        const parserClass = parseClassNameFromAssemblyName(assembly)
        const res = { assembly, name } as AssetParseResult<AvailParserName | undefined>
        const parser = parserClass && map[parserClass]
        if (parser) {
            res.parser = parserClass
            res.data = parser(data)
        } else {
            res.data = data
        }
        return res
    }
}
