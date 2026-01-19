import decodeBoolean from "../../../datatypes/bool.js"
import { decodeUint32 } from "../../../datatypes/uint.js"
export interface ImageImporterResult {
    forceLinear: boolean
    images: Uint8Array[]
}
/**
 * 
 * @param data 
 * @see https://github.com/tony56a/crp-parser/blob/39cbeffee5b217d697e4d22766b300fe4717779a/ConsoleApplication1/Parsers/ImgParser.cs#L14
 */
export default function parser(data: Uint8Array): ImageImporterResult {
    let i = 0
    const iterator = (count: number): Uint8Array => {
        if (i + count > data.length) {
            throw new Error('unexpected end of data, index: ' + i)
        }
        const result = data.subarray(i, i + count);
        i += count;
        return result;
    }
    const forceLinear = decodeBoolean(iterator)
    const imageCount = decodeUint32(iterator)
    if (imageCount === data.length - i) {
        return {
            forceLinear, images: [data.subarray(i)]
        }
    }
    const images = [] as Uint8Array[]
    for (let j = 0; j < imageCount; j++) {
        const len = decodeUint32(iterator)
        const end = i + len
        const imgData = data.subarray(i, end)
        i = end
        images.push(imgData)
    }
    return {
        forceLinear: forceLinear,
        images: images
    }
}