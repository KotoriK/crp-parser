import { buildAssetEntryDataGetter, CRAPAssetEntry, isAssetParsable } from "./sections/assetEntry.js";
import createAssetDataParser from "./sections/assets/factory.js";
import { ParserMap } from "./sections/assets/parser-map.js";
import { CRAPHeader, parseHeader } from "./sections/header.js";
import { getIterator } from "./utils.js";

export const SYMBOL_NOT_PARSABLE = Symbol('not parsable')
export class CRAP<M extends ParserMap> implements CRAPHeader {
    getter: (entry: CRAPAssetEntry) => Uint8Array;
    parser: ReturnType<typeof createAssetDataParser<M>>;
    constructor(buf: ArrayBuffer, parserMap: M) {
        const buffer = new Uint8Array(buf);
        const iterator = getIterator(buffer);
        const header = parseHeader(iterator);
        Object.assign(this, header);
        this.getter = buildAssetEntryDataGetter(this.dataOffset, buffer);
        this.parser = createAssetDataParser(parserMap);
    }
    declare fileFormat: number;
    declare packageName: string;
    declare authorName: string;
    declare packageVersion: number;
    declare mainAssetName: string;
    declare fileCount: number;
    declare dataOffset: number;
    declare assetEntries: CRAPAssetEntry[];
    get(index: number) {
        return this.getter(this.assetEntries[index]);
    }
    getAll() {
        return this.assetEntries.map(entry => this.getter(entry))
    }
    parse(index: number) {
        return this.parser(this.get(index))
    }
    parseAll() {
        return this.assetEntries.map(entry => {
            if (isAssetParsable(entry.type)) {
                return this.parser(this.getter(entry))
            } else {
                return SYMBOL_NOT_PARSABLE
            }
        })
    }
    isParsable(index: number) {
        return isAssetParsable(this.assetEntries[index].type)
    }
    solveRef(ref: string) {
        return this.assetEntries.find(entry => entry.checksum === ref)
    }
}