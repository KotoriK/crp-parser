export function getIterator(input: Uint8Array) {
    let index = 0;
    const next = (count: number): Uint8Array => {
        if (index + count > input.length) {
            throw new Error("Unexpected end of input");
        }
        const result = input.subarray(index, index + count);
        index += count;
        return result;
    }
    return next;
}