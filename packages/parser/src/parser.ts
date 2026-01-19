import { buildAssetEntryDataGetter, CRAPAssetEntry, isAssetParsable } from "./sections/assetEntry.js";
import createAssetDataParser from "./sections/assets/factory.js";
import { ParserMap } from "./sections/assets/parser-map.js";
import { CRAPHeader, parseHeader } from "./sections/header.js";
import { getIterator } from "./utils.js";

/**
 * Symbol returned by `parseAll` when an asset is not parsable (e.g., unknown asset type).
 */
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

/**
 * Main parser class for Cities: Skylines CRAP (CRP Archive Package) files.
 *
 * @template M - The parser map type that defines available asset parsers.
 *
 * @example
 * ```typescript
 * import { CRAP, ALL_KNOWN_PARSER_MAP } from '@kotorik/crp-parser';
 * import { readFile } from 'node:fs/promises';
 *
 * const file = await readFile('path/to/file.crp');
 * const crap = new CRAP(file.buffer, ALL_KNOWN_PARSER_MAP);
 *
 * // Access metadata
 * console.log(crap.packageName, crap.authorName);
 *
 * // Parse an asset
 * const result = crap.parse(crap.assetEntries[0]);
 * ```
 *
 * @see https://skylines.paradoxwikis.com/CRAP_File_Format
 */
export class CRAP<M extends ParserMap> implements CRAPHeader {
    /** Function to get raw asset data by entry. */
    declare get: (entry: CRAPAssetEntry) => Uint8Array;
    /** Parser function for asset data. Returns parsed data or Error if `ignoreError` is true. */
    declare parser: ReturnType<typeof safe<ReturnType<typeof createAssetDataParser<M>>>>;
    /** CRAP file format version. */
    declare fileFormat: number;
    /** Name of the package. */
    declare packageName: string;
    /** Name of the package author. */
    declare authorName: string;
    /** Package version number. */
    declare packageVersion: number;
    /** Name of the main asset in the package. */
    declare mainAssetName: string;
    /** Number of files/assets in the package. */
    declare fileCount: number;
    /** Byte offset where asset data begins. */
    declare dataOffset: number;
    /** Array of asset entries in the package. */
    declare assetEntries: CRAPAssetEntry[];

    /**
     * Creates a new CRAP parser instance.
     *
     * @param buf - The raw ArrayBuffer containing the CRAP file data.
     * @param parserMap - A map of asset type names to their corresponding parser functions.
     * @param ignoreError - If true, parsing errors are caught and returned as Error objects instead of throwing. Default is `true`.
     */
    constructor(buf: ArrayBuffer, parserMap: M, ignoreError = true) {
        const buffer = new Uint8Array(buf);
        const iterator = getIterator(buffer);
        const header = parseHeader(iterator);
        const _p = createAssetDataParser(parserMap)

        Object.assign(this, header);
        this.get = buildAssetEntryDataGetter(this.dataOffset, buffer);
        this.parser = ignoreError ? safe(_p) : _p;
    }

    /**
     * Parse a single asset entry.
     *
     * @param entry - The asset entry to parse.
     * @returns The parsed asset data, or an Error if parsing failed (when `ignoreError` is true).
     */
    parse(entry: CRAPAssetEntry) {
        return this.parser(this.get(entry))
    }

    /**
     * Parse all assets in the package.
     *
     * @param force - If true, attempts to parse all assets regardless of their type. If false, only parsable assets are parsed. Default is `false`.
     * @returns An array of parsed results. Non-parsable assets return `SYMBOL_NOT_PARSABLE` when `force` is false.
     */
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

    /**
     * Check if an asset at the given index is parsable.
     *
     * @param index - The index of the asset entry in `assetEntries`.
     * @returns `true` if the asset type is known and parsable, `false` otherwise.
     */
    isParsable(index: number) {
        return isAssetParsable(this.assetEntries[index].type)
    }

    /**
     * Find an asset entry by its checksum reference.
     *
     * @param ref - The checksum string to search for.
     * @returns The matching `CRAPAssetEntry` if found, `undefined` otherwise.
     */
    solveRef(ref: string) {
        return this.assetEntries.find(entry => entry.checksum === ref)
    }
}