export function getIterator(input: Uint8Array) {
    let index = 0;
    const next = (count: number): DataView => {
        if (index + count > input.length) {
            throw new Error("Unexpected end of input");
        }
        const result = new DataView(input.buffer, input.byteOffset + index, count);
        index += count;
        return result;
    }
    return next;
}