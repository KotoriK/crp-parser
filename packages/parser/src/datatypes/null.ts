
export function expectEqualZero(byte: number) {
    if (byte !== 0) {
        throw new Error(`Expected \\0, got ${byte}`);
    }
}
export function expectNull(acquireNewBytes: (count: number) => Uint8Array) {
    expectEqualZero(acquireNewBytes(1)[0])
}
