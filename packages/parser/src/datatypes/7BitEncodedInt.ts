export default function decode7BitEncodedInt(accuireNewByte: () => number) {
    let value = 0;
    let shift = 0;
    let byte;
    do {
        byte = accuireNewByte();
        value |= (byte & 0x7F) << shift;
        shift += 7;
    } while ((byte & 0x80) != 0);
    return value;
}