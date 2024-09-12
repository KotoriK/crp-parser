import decode7BitEncodedInt from "./7BitEncodedInt.js";

/**
 * 
 * @param accuireNextByte 
 * @returns 
 * @see https://github.com/dotnet/runtime/blob/5535e31a712343a63f5d7d796cd874e563e5ac14/src/libraries/System.Private.CoreLib/src/System/IO/BinaryReader.cs#L252
 */
export default function decodePStr(accuireNextByte: () => number) {
    const length = decode7BitEncodedInt(accuireNextByte);
    const buf = new Uint8Array(length);
    
    try {
        for (let i = 0; i < length; i++) {
            buf[i] = accuireNextByte();
        }
        return new TextDecoder().decode(buf);
    } catch (e) {
        throw new Error(`Invalid PStr: "${new TextDecoder().decode(buf)}" (expect length: ${length})`, { cause: e });
    }
}