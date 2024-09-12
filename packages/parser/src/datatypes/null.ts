
export function expectEqualZero(byte: number) {
    if (byte !== 0) {
        throw new Error(`Expected \\0, got ${byte}`);
    }
}
export function expectNull(accuireNextByte: () => number) {
    expectEqualZero(accuireNextByte())
}
