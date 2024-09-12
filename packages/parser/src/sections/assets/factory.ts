import { expectEqualZero } from "../../datatypes/null.js";
import { decodeNETBinary } from "./BinaryDeserializer.js";
import { type ParserMap } from "./parser-map.js";
import { parseClassNameFromAssemblyName } from "./utils.js";

export default function createAssetDataParser<M extends ParserMap>(map: M) {
    type AvailParserName = keyof M
    interface AssetParseResult<P extends AvailParserName> {
        parser?: P
        assembly: string
        name: string
        data: P extends AvailParserName ? ReturnType<M[P]> : Uint8Array
    }
    return (assetData: Uint8Array) => {
        expectEqualZero(assetData[0])
        const { assembly, name, data } = decodeNETBinary(assetData.subarray(1))
        const parserClass = parseClassNameFromAssemblyName(assembly)
        let parseResult
        const parser = map[parserClass]
        if (parser) {
            parseResult = parser(data)
        } else {
            parseResult = data
        }
        return {
            parser: parser ? parserClass as AvailParserName : undefined,
            assembly: assembly,
            name: name,
            data: parseResult
        } satisfies AssetParseResult<AvailParserName>
    }
}
