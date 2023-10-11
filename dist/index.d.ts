import { Spec } from 'arg';

type ProcessResult = {
    status: number;
    body: any;
};
type ParseArgvResult = {
    args: string[];
    options: CommandOptions;
};
type CommandOptions = {
    [key: string]: any;
};
declare function parseCmdUrl(url: string): string[];
declare function processCmdReq(req: Request, parse: (argv: string[]) => ParseArgvResult, cmd: (...args: any[]) => Promise<any>): Promise<ProcessResult>;
declare function parseArgv(argv: string[], spec: Spec): ParseArgvResult;
declare function parseCmdReq(req: Request, spec: Spec, cmd: (...args: any[]) => Promise<any>): Promise<ProcessResult>;

export { CommandOptions, ParseArgvResult, ProcessResult, parseArgv, parseCmdReq, parseCmdUrl, processCmdReq };
