export function parseClassNameFromAssemblyName(assemblyName: string) {
    return assemblyName.split(",").shift()
}