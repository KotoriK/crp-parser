// little-endian
export function decodeUint16(accuireNextByte: () => number) {
    let result = 0;
    result |= accuireNextByte();
    result |= accuireNextByte() << 8;
    return result;
}
export function decodeUint32(accuireNextByte: () => number) {
    let result = 0;
    result |= accuireNextByte();
    result |= accuireNextByte() << 8;
    result |= accuireNextByte() << 16;
    result |= accuireNextByte() << 24;
    return result;
}
export function decodeInt32(accuireNextByte: () => number) {
    const result = decodeUint32(accuireNextByte);
    if (result > 0x7fffffff) {
        return result - 0x100000000;
    }
    return result;
}
export function decodeSingle(accuireNextByte: () => number) {
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setUint8(0, accuireNextByte());
    view.setUint8(1, accuireNextByte());
    view.setUint8(2, accuireNextByte());
    view.setUint8(3, accuireNextByte());
    return view.getFloat32(0, true);
}
export function decodeUint64BigInt(accuireNextByte: () => number) {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint8(0, accuireNextByte());
    view.setUint8(1, accuireNextByte());
    view.setUint8(2, accuireNextByte());
    view.setUint8(3, accuireNextByte());
    view.setUint8(4, accuireNextByte());
    view.setUint8(5, accuireNextByte());
    view.setUint8(6, accuireNextByte());
    view.setUint8(7, accuireNextByte());
    return view.getBigUint64(0, true);
}
export function decodeUint64(accuireNextByte: () => number){
    const bigint = decodeUint64BigInt(accuireNextByte);
    if (bigint > Number.MAX_SAFE_INTEGER) {
        throw new Error("BigInt(" + bigint.toString() + ") is too large to be represented as a number");
    }
    return Number(bigint);
}