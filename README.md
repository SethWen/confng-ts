# confng-ts

A simple configuration management tool for Node.js.
You can use it to manage your Node.js application's configuration in a simple and flexible way.

### Install

```
npm install confng-ts
```

### Usage

```typescript
import { Conf } from 'confng-ts';

// create a new Conf instance with a config object and mergeEnvOptions
// If you don't want to merge environment variables, you can omit the mergeEnvOptions option.
// The value of `config` is JSON. You can parse it from json/toml/yaml/... file, or directly pass an object.
// The logic should be implemented in your own code.
const conf = new Conf({
    config: {
        "name": "foo",
        "server": {
            "port": 3000,
            "host": "localhost"
        },
        "redisUri": "redis://localhost:6379"
    },
    mergeEnvOptions: {
        prefix: 'FOO',
        separator: '__',
    },
});

console.log(conf.get('name')); // foo
console.log(conf.get('server.port')); // 3000
console.log(conf.get('server.host')); // localhost
console.log(conf.get('redisUri')); // redis://localhost:6379

// The inner of Conf will guess the type of the value automatically from the initial config object.
// So the inital config object should be in full form, and the value of each key should be in the correct type.

// if the following environment variables setted 
// FOO__SERVER__PORT=4000 
// FOO__SERVER__HOST=example.com
// FOO__REDIS_URI=redis://example.com:6379
console.log(conf.get('server.port')); // here will return 4000 and the data type is number.
console.log(conf.get('server.host')); // example.com
console.log(conf.get('redisUri')); // redis://example.com:6379
```

### Migrate from [config](https://www.npmjs.com/package/config)

```typescript
import { readFile } from 'node:fs/promises';
import { Conf } from 'confng-ts';

// If using `config` before, the config file should locate in the `config` directory, and the file name should be `default.json` or `development.json` or `production.json` or `test.json` or other names.
const configPath = `config/${process.env.NODE_ENV || 'default'}.json`;
const conf = new Conf({
    config: await readFile(configPath, 'utf8'),
    mergeEnvOptions: {
        prefix: 'FOO',
        separator: '__',
    },
});

// Then replace all `config.get()` with `conf.get()` in your code.
```

### Thanks

This package is inspired by the following packages:

- [config of Node.js](https://www.npmjs.com/package/config)
- [config of rust](https://crates.io/crates/config)