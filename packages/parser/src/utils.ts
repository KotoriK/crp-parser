export type AcquireDataFn = (count: number) => DataView;

export function getIterator(input: Uint8Array): AcquireDataFn {
    let index = 0;
    const next: AcquireDataFn = (count) => {
        if (index + count > input.length) {
            throw new Error("Unexpected end of input");
        }
        const result = new DataView(input.buffer, input.byteOffset + index, count);
        index += count;
        return result;
    }
    return next;
}