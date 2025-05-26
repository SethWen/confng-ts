# confng

A simple configuration management tool for Node.js, confng means config for next-generation.

### Install

```
npm install confng
```

### Usage

```typescript
import { Conf } from 'conf-ts';

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
    },
    mergeEnvOptions: {
        prefix: 'FOO',
        separator: '__',
    },
});

console.log(conf.get('name')); // foo
console.log(conf.get('server.port')); // 3000
console.log(conf.get('server.host')); // localhost

// if the following environment variables setted 
// FOO__SERVER__PORT=4000 
// FOO__SERVER__HOST=example.com
console.log(conf.get('server.port')); // 4000
console.log(conf.get('server.host')); // example.com
```

### Migrate from [config](https://www.npmjs.com/package/config)

```typescript
import { readFile } from 'node:fs/promises';
import { Conf } from 'conf-ts';

const configPath = `config/${process.env.NODE_ENV || 'default'}.json`;
const conf = new Conf({
    config: await readFile('config.json', 'utf8'),
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