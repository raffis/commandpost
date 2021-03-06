// sample.
// tsc -p ./
// node usage.js -r -c a.json b.txt --config=c.json remote -v d add e.txt -- f.txt

import * as commandpost from "commandpost";

interface RootOptions {
    replace: boolean;
    config: string[];
}
interface RootArgs {
}

let root = commandpost
    .create<RootOptions, RootArgs>("usg")
    .version("100.0.0", "-v, --version")
    .description("foo bar")
    .option("-r, --replace", "replace files")
    .option("--no-output", "silent mode")
    .option("-c, --config <file>", "specified config file")
    .action((opts, args, rest) => {
        console.log("root action");
        console.log(opts);
        console.log(args);
        console.log(rest);
    });

interface RemoteOptions {
    verbose: boolean;
}
interface RemoteArgs {
    remoteUrl: string;
}

let remote = root
    .subCommand<RemoteOptions, RemoteArgs>("remote <remoteUrl>")
    .description("about remote repos")
    .option("-v, --verbose")
    .action((opts, args, rest) => {
        console.log("remote action");
        console.log(opts);
        console.log(args);
        console.log(rest);
    });

interface RemoteAddOptions {
}
interface RemoteAddArgs {
    remoteUrls: string[];
}

let add = remote
    .subCommand<RemoteAddOptions, RemoteAddArgs>("add <remoteUrls...>")
    .help("-p, --pleh", "HELP MEEEEEEEEEE!!!!")
    .allowUnknownOption()
    .action((opts, args, rest) => {
        return remote
            .exec()
            .then(() => {
                console.log("remote add action");
                console.log(opts);
                console.log(args);
                console.log(rest);
                console.log("!root", root.parsedOpts, root.parsedArgs, root._rest);
                console.log("!remote", remote.parsedOpts, remote.parsedArgs, remote._rest);
                console.log("!remote add", opts, args, rest);
                console.log("!remote add unknown options", add.unknownOptions);
            });
    });

commandpost
    .exec(root, process.argv)
    .catch(err => {
        if (err instanceof Error) {
            console.error(err.stack);
        } else {
            console.error(err);
        }
        process.exit(1);
    });
