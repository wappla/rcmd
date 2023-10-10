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
const command = new Command(spec, async (name, options) => {
    const { step } = options
    db.migrate.rollback({ step })
})

export async function GET(req) {
    const { status, body } = await command.parse(req)
    return NextResponse.json(body, { status })
}
```
