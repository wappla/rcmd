import arg, { type Spec } from 'arg'

export type ProcessResult = {
    status: number
    body: any
}

export type ParseArgvResult = {
    args: string[]
    options: CommandOptions
}

export type CommandOptions = {
    [key: string]: any
}

export function parseCmdUrl(url: string) {
    const query = new URL(url).searchParams.get('argv')
    let argv: string[] = []
    if (query !== null) {
        argv = query.split(' ')
    }
    return argv
}

export async function processCmdReq(
    req: Request,
    parse: (argv: string[]) => ParseArgvResult,
    cmd: (...args: any[]) => Promise<any>
): Promise<ProcessResult> {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.RCMD_SECRET}`) {
        return {
            status: 401,
            body: { success: false },
        }
    }
    try {
        const argv = parseCmdUrl(req.url)
        const { args, options } = parse(argv)
        const result = await cmd(...args, options)
        return {
            status: 200,
            body: { success: true, result },
        }
    } catch (e: any) {
        const error = {
            message: e.message,
            stack: e.stack,
            name: e.name,
            cause: e.cause,
        }
        return {
            status: 500,
            body: { success: false, error },
        }
    }
}

export function parseArgv(argv: string[], spec: Spec): ParseArgvResult {
    const result = arg(spec, {
        permissive: false,
        argv: argv.slice(3),
    })
    const { _: args, ...rest } = result
    const options = Object.entries(rest).reduce(
        (acc: CommandOptions, [key, value]) => {
            acc[key.replace('--', '')] = value
            return acc
        },
        {}
    )
    return { args, options }
}

export async function parseCmdReq(
    req: Request,
    spec: Spec,
    cmd: (...args: any[]) => Promise<any>
) {
    return processCmdReq(req, (argv: string[]) => parseArgv(argv, spec), cmd)
}
