export function getIterator(input: Iterable<number>) {
    const iterator = input[Symbol.iterator]()
    const next = () => {
        const res = iterator.next();
        if (res.done) {
            throw new Error("Unexpected end of input");
        }
        return res.value;
    }
    return next;
}