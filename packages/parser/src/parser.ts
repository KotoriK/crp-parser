import { buildAssetEntryDataGetter, CRAPAssetEntry, isAssetParsable } from "./sections/assetEntry.js";
import createAssetDataParser from "./sections/assets/factory.js";
import { ParserMap } from "./sections/assets/parser-map.js";
import { CRAPHeader, parseHeader } from "./sections/header.js";
import { getIterator } from "./utils.js";

export const SYMBOL_NOT_PARSABLE = Symbol('not parsable')
function safe<T extends (...args: any) => any>(fn: T) {
    return (...args: Parameters<T>) => {
        try {
            return fn(...args) as ReturnType<T>
        } catch (error) {
            return error as Error
        }
    }
}
export class CRAP<M extends ParserMap> implements CRAPHeader {
    declare get: (entry: CRAPAssetEntry) => Uint8Array;
    declare parser: ReturnType<typeof safe<ReturnType<typeof createAssetDataParser<M>>>>;
    declare fileFormat: number;
    declare packageName: string;
    declare authorName: string;
    declare packageVersion: number;
    declare mainAssetName: string;
    declare fileCount: number;
    declare dataOffset: number;
    declare assetEntries: CRAPAssetEntry[];

    constructor(buf: ArrayBuffer, parserMap: M, ignoreError = true) {
        const buffer = new Uint8Array(buf);
        const iterator = getIterator(buffer);
        const header = parseHeader(iterator);
        const _p = createAssetDataParser(parserMap)

        Object.assign(this, header);
        this.get = buildAssetEntryDataGetter(this.dataOffset, buffer);
        this.parser = ignoreError ? safe(_p) : _p;
    }
    parse(entry: CRAPAssetEntry) {
        return this.parser(this.get(entry))
    }
    parseAll(force: boolean = false) {
        return this.assetEntries.map(force
            ? entry => this.parser(this.get(entry))
            : entry => {
                if (isAssetParsable(entry.type)) {
                    return this.parser(this.get(entry))
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