export default function decode7BitEncodedInt(acquireNewBytes: (count: number) => Uint8Array) {
    let value = 0;
    let shift = 0;
    let byte;
    do {
        byte = acquireNewBytes(1)[0];
        value |= (byte & 0x7F) << shift;
        shift += 7;
    } while ((byte & 0x80) != 0);
    return value;
}