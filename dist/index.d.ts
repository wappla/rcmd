import { Spec } from 'arg';

type ProcessResult = {
    status: number;
    body: any;
};
type CommandOptions = {
    [key: string]: any;
};
declare function parseCmdUrl(url: string): string[];
declare function processCmdReq(req: Request, parse: (argv: string[]) => Promise<void>): Promise<ProcessResult>;
declare class Command {
    _spec: Spec;
    _action: (...args: any[]) => Promise<void>;
    constructor(spec: Spec, action: (...args: any[]) => Promise<void>);
    parse(req: Request): Promise<ProcessResult> | undefined;
}

export { Command, CommandOptions, ProcessResult, parseCmdUrl, processCmdReq };
