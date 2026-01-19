import type { AcquireDataFn } from "../utils.js";

export default function decode7BitEncodedInt(acquireData: AcquireDataFn) {
    let value = 0;
    let shift = 0;
    let byte;
    do {
        byte = acquireData(1).getUint8(0);
        value |= (byte & 0x7F) << shift;
        shift += 7;
    } while ((byte & 0x80) != 0);
    return value;
}