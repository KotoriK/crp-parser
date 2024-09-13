export function parseClassNameFromAssemblyName(assemblyName: string) {
    const spliterIndex = assemblyName.indexOf(", ")
    if (spliterIndex === -1) {
        return undefined
    } else {
        return assemblyName.substring(0, spliterIndex)
    }
}