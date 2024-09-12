import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { ALL_KNOWN_PARSER_MAP, CRAP } from '@kotorik/crp-parser'


async function main() {
    const { path } = await yargs(hideBin(process.argv))
        .command("$0 <path>", "parse a CRAP file").positional("path", { describe: "path to the file", type: 'string' })
        .help().parse()
    const finalPath = resolve(process.cwd(), path)
    const file = await readFile(finalPath)
    const result = new CRAP(file, ALL_KNOWN_PARSER_MAP)
    console.log(result.parse(3), result.assetEntries)
}

main()