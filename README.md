# confng

A simple configuration management tool for Node.js, confng means config for next-generation.

### Install

```
npm install confng
```

### Usage

```typescript
import { Conf } from 'confng';

const conf = new Conf({
    config: {
        "name": "foo",
        "server": {
            "port": 3000,
            "host": "localhost"
        },
    },
    mergeEnvOptions: {
        prefix: 'RUM',
        separator: '__',
    },
});

console.log(conf.get('name')); // foo
console.log(conf.get('server.port')); // 3000
console.log(conf.get('server.host')); // localhost
```