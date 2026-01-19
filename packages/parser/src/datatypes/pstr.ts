import decode7BitEncodedInt from "./7BitEncodedInt.js";

/**
 * 
 * @param acquireData 
 * @returns 
 * @see https://github.com/dotnet/runtime/blob/5535e31a712343a63f5d7d796cd874e563e5ac14/src/libraries/System.Private.CoreLib/src/System/IO/BinaryReader.cs#L252
 */
export default function decodePStr(acquireData: (count: number) => DataView) {
    const length = decode7BitEncodedInt(acquireData);
    
    try {
        const view = acquireData(length);
        const buf = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
        return new TextDecoder().decode(buf);
    } catch (e) {
        throw new Error(`Invalid PStr: (expect length: ${length})`, { cause: e });
    }
}