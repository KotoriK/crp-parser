// little-endian
export function decodeUint16(acquireNewBytes: (count: number) => Uint8Array) {
    const bytes = acquireNewBytes(2);
    let result = 0;
    result |= bytes[0];
    result |= bytes[1] << 8;
    return result;
}
export function decodeUint32(acquireNewBytes: (count: number) => Uint8Array) {
    const bytes = acquireNewBytes(4);
    let result = 0;
    result |= bytes[0];
    result |= bytes[1] << 8;
    result |= bytes[2] << 16;
    result |= bytes[3] << 24;
    return result;
}
export function decodeInt32(acquireNewBytes: (count: number) => Uint8Array) {
    const result = decodeUint32(acquireNewBytes);
    if (result > 0x7fffffff) {
        return result - 0x100000000;
    }
    return result;
}
export function decodeSingle(acquireNewBytes: (count: number) => Uint8Array) {
    const bytes = acquireNewBytes(4);
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setUint8(0, bytes[0]);
    view.setUint8(1, bytes[1]);
    view.setUint8(2, bytes[2]);
    view.setUint8(3, bytes[3]);
    return view.getFloat32(0, true);
}
export function decodeUint64BigInt(acquireNewBytes: (count: number) => Uint8Array) {
    const bytes = acquireNewBytes(8);
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint8(0, bytes[0]);
    view.setUint8(1, bytes[1]);
    view.setUint8(2, bytes[2]);
    view.setUint8(3, bytes[3]);
    view.setUint8(4, bytes[4]);
    view.setUint8(5, bytes[5]);
    view.setUint8(6, bytes[6]);
    view.setUint8(7, bytes[7]);
    return view.getBigUint64(0, true);
}
export function decodeUint64(acquireNewBytes: (count: number) => Uint8Array){
    const bigint = decodeUint64BigInt(acquireNewBytes);
    if (bigint > Number.MAX_SAFE_INTEGER) {
        throw new Error("BigInt(" + bigint.toString() + ") is too large to be represented as a number");
    }
    return Number(bigint);
}