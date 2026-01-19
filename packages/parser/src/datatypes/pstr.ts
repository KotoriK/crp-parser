import decode7BitEncodedInt from "./7BitEncodedInt.js";

/**
 * 
 * @param acquireNewBytes 
 * @returns 
 * @see https://github.com/dotnet/runtime/blob/5535e31a712343a63f5d7d796cd874e563e5ac14/src/libraries/System.Private.CoreLib/src/System/IO/BinaryReader.cs#L252
 */
export default function decodePStr(acquireNewBytes: (count: number) => Uint8Array) {
    const length = decode7BitEncodedInt(acquireNewBytes);
    
    try {
        const buf = acquireNewBytes(length);
        return new TextDecoder().decode(buf);
    } catch (e) {
        throw new Error(`Invalid PStr: (expect length: ${length})`, { cause: e });
    }
}