#!/usr/bin/env node
import { cosmiconfig } from 'cosmiconfig'

export async function main(argv: string[]) {
    const configExplorer = cosmiconfig('rcmd')
    const explorerResult = await configExplorer.search()
    if (explorerResult === null) {
        throw Error('No rcmd config found')
    }
    const { config } = explorerResult
    const { envs, basePath } = config
    const envOptions = Object.keys(envs).map((key) => `--${key}`)
    const [envOption] = argv.filter((arg) => envOptions.includes(arg))
    if (!envOption) {
        throw Error('No env option specified')
    }
    const env = envOption.replace('--', '')
    const envHost = config.envs[env]
    const finalArgv = argv.filter((arg) => !envOptions.includes(arg))
    const path = argv[2]
    const result = await fetch(
        `${envHost}/${basePath}/${path}?argv=${finalArgv.join(' ')}`,
        { headers: { authorization: `Bearer ${process.env.RCMD_SECRET}` } }
    )
    const body = await result.json()
}

main(process.argv)