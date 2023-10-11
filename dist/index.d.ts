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
declare function parseCmdReq(req: Request, spec: Spec, cmd: (...args: any[]) => Promise<void>): Promise<ProcessResult>;
declare class Command {
    _spec: Spec;
    _action: (...args: any[]) => Promise<void>;
    constructor(spec: Spec, action: (...args: any[]) => Promise<void>);
    parse(req: Request): Promise<ProcessResult>;
}

export { Command, CommandOptions, ProcessResult, parseCmdReq, parseCmdUrl, processCmdReq };
