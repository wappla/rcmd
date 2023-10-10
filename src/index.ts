import arg, { type Spec } from 'arg'

export type ProcessResult = {
    status: number
    body: any
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
    parse: (argv: string[]) => Promise<void>
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
        await parse(argv)
        return {
            status: 200,
            body: { success: true },
        }
    } catch (error) {
        return {
            status: 500,
            body: { success: false, error },
        }
    }
}

export class Command {
    _spec: Spec
    _action: (...args: any[]) => Promise<void>
    constructor(spec: Spec, action: (...args: any[]) => Promise<void>) {
        this._spec = spec
        this._action = action
    }
    parse(req: Request) {
        if (this._action !== null && this._spec !== null) {
            return processCmdReq(req, async (argv) => {
                const args = arg(this._spec, {
                    permissive: false,
                    argv: argv.slice(3),
                })
                const { _: actionArgs, ...options } = args
                const actionOptions = Object.entries(options).reduce(
                    (acc: CommandOptions, [key, value]) => {
                        acc[key.replace('--', '')] = value
                        return acc
                    },
                    {}
                )
                await this._action(...actionArgs, actionOptions)
            })
        }
    }
}
