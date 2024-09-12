/**
 * 
 * @param acquireNextByte 
 * @returns 
 * @see https://github.com/dotnet/runtime/blob/5535e31a712343a63f5d7d796cd874e563e5ac14/src/libraries/System.Private.CoreLib/src/System/IO/BinaryReader.cs#L211
 */
export default function decodeBoolean(acquireNextByte: () => number) {
    return acquireNextByte() != 0;
}