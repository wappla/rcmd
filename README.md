# rcmd

Route command (rcmd) helps you execute commands locally or on remote environments using api routes.

## Usage

Inside your Node project directory, run the following:

```sh
npm i --save rcmd
```

Or with Yarn:

```sh
yarn add rcmd
```

Start executing commands:

```sh
rcmd db/migrate/latest --production
```

## What is rcmd?

Rcmd is a simple CLI tool and a handy request handler utility. The Essence of this library can be simplified to the code below.

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

The CLI will send the argv as a query param to a url. The req handler will parse the argv based on a spec and pass the parsed options to a command function. Thats basically it.

## Why would you want to do that?

Commands are a handy tool in the arsenal of a developer to execute technical operations on a local or remote environment. Executing command on serverless environments can be tricky. Especially when commands rely on environments secrets (e.g. database operations).

## API

Config inside `.rcmdrc`

```json
{
    "basePath": "/cmd",
    "envs": {
        "local": "http://localhost:3000",
        "development": "https://development.example.com",
        "staging": "http://staging.example.com",
        "production": "http://example.com"
    }
}
```

Run command locally

```sh
rcmd db/migrate/latest --local
```

or on remote environments

```sh
RCMD_SECRET="secret" rcmd db/migrate/latest --production
```

you can pass options

```sh
rcmd db/migrate/rollback --local --step=5
```

Define routes for example using next.js

```javascript
// /cmd/db/migrate/rollback/route.ts

const spec = { '--step': Number }
const command = new Command(spec, async ({ step }) => {
    db.migrate.rollback({ step })
})

export async function GET(req) {
    const { status, body } = await command.parse(req)
    return NextResponse.json(body, { status })
}
```
