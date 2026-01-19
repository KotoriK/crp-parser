import type { AcquireDataFn } from "../utils.js";

export function expectEqualZero(byte: number) {
    if (byte !== 0) {
        throw new Error(`Expected \\0, got ${byte}`);
    }
}
export function expectNull(acquireData: AcquireDataFn) {
    expectEqualZero(acquireData(1).getUint8(0))
}
