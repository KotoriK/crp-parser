import type { AcquireDataFn } from "../utils.js";

// little-endian
export function decodeUint16(acquireData: AcquireDataFn) {
    return acquireData(2).getUint16(0, true);
}
export function decodeUint32(acquireData: AcquireDataFn) {
    return acquireData(4).getUint32(0, true);
}
export function decodeInt32(acquireData: AcquireDataFn) {
    return acquireData(4).getInt32(0, true);
}
export function decodeSingle(acquireData: AcquireDataFn) {
    return acquireData(4).getFloat32(0, true);
}
export function decodeUint64BigInt(acquireData: AcquireDataFn) {
    return acquireData(8).getBigUint64(0, true);
}
export function decodeUint64(acquireData: AcquireDataFn){
    const bigint = decodeUint64BigInt(acquireData);
    if (bigint > Number.MAX_SAFE_INTEGER) {
        throw new Error("BigInt(" + bigint.toString() + ") is too large to be represented as a number");
    }
    return Number(bigint);
}