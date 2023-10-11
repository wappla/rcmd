# rcmd

Route command (rcmd) helps you execute commands locally or on remote environments using api routes.

## Usage

Inside your Node project directory, run the following:

```sh
npm i --save rcmd
```

Start executing commands:

```sh
rcmd https://example.com/api/db/migrate/latest --force
```

or with using some additional [config](#config)

```sh
rcmd db/migrate/latest --production --force
```

Or if your only using the cli:

```sh
npx rcmd db/migrate/latest --production --force
```

## What is rcmd?

`rcmd` is a simple CLI tool and a handy request handler utility. The Essence of this library can be simplified to the code below.

```js
// cli
async function rcmd() {
    const authorization = `Bearer ${process.env.RCMD_SECRET}`
    const result = await fetch(
        `${environment}/${route}?argv=${process.argv.join(' ')}`,
        { headers: { authorization:  } }
    )
}
// parseCmdReq
async function parseCmdReq(req, spec, cmd) {
    const authorization = req.headers.get('authorization')
    if (authorization !== `Bearer ${process.env.RCMD_SECRET}`) {
        throw new Error('Unauthorized')
    }
    const argv = new URL(req.url).searchParams.get('argv')
    const args = praseArgv(argv, spec)
    await cmd(...args)
}
```

The CLI will simply send the `process.argv` as a query param to a url. The req handler utility will parse the argv based on a spec and pass the parsed options to a command function. Thats basically it.

## Why would you want to do that?

Commands are a useful tool for developers to perform technical operations via the command line interface (CLI) on a local or remote environment. However, executing commands on serverless environments can be challenging since there is no physical machine to run the commands on. Additionally, when commands depend on environment secrets (such as database operations), sharing these secrets with the remote environment and the machine executing the command can be a difficult problem. By using `rcmd`, you can overcome these problems by simply exposing API routes that correspond to the commands you want to execute.

## Config

Config inside `.rcmdrc` or [other formats ](https://github.com/cosmiconfig/cosmiconfig)

```json
{
    "envSecret": "RCMD_SECRET",
    "basePath": "/cmd",
    "envs": {
        "local": "http://localhost:3000",
        "development": "https://development.example.com",
        "staging": "http://staging.example.com",
        "production": "http://example.com"
    }
}
```

## Example

Expose a route on your server:

````javascript
// Next.js app/cmd/db/migrate/rollback/route.ts

export async function GET(req) {
    const spec = { '--step': Number }
    const { status, body } = await parseCmdReq(req, spec, async ({ step }) => {
        db.migrate.rollback({ step })
    })
    return NextResponse.json(body, { status })
}
```

Run command locally

```sh
rcmd db/migrate/rollback --local
````

or on remote environment

```sh
RCMD_SECRET="secret" rcmd db/migrate/rollback --production
```

you can pass options

```sh
rcmd db/migrate/rollback --local --step=5
```

## limitation

It is not possible to make interactive commands with tools like `inquirer` or `prompts`.

## Custom parsing

There is nothing special about the cli tool it just send the `process.argv` as query params to a route.

```sh
rcmd db/migrate/rollback --local --step=5
```

will be converted to

```
https://localhost:3000/cmd/db/migrate/rollback?argv="--step=5"
```

`rcmd` automatically excluded arguments env option (`--local`, ` --staging`, etc.). So if you want to have custom parsing for your commands or just want to pass them to something like a library like `commander` it's perfectly possible

```javascript
// Next.js
// app/cmd/db/migrate/rollback/route.ts
import { Command } from 'commander'

export async function GET(req) {
    checkSecret(req)
    const argv = new URL(req.url).searchParams.get('argv')
    const program = new Command()
    program.name('db/migrate/rollback').option('-s, --step <number>')
    program.parse(argv)
}
```

## Additional benefits

You can als use tools like `curl` to execute the same commands.

```js
curl -XGET \
	"https://localhost:3000/cmd/db/migrate/rollback?argv='--step=5'" \
	-H "Authorization: Bearer secret"
```

## FAQ

A few questions and answers that have been asked before:

### Is this safe?

### How to execute commands as part of deployment?

### You are still sharing a secret. How is this different?
