import assert from 'node:assert';
import snakify from 'snakify-ts';

console.log(snakify('DPrintData'));

const parsers = {
  integer: (v: string, k: string) => {
    const num = Number.parseInt(v);
    assert(Number.isNaN(num) === false, `Invalid ${k} value: ${v}`);
    return num;
  },
  float: (v: string, k: string) => {
    const num = Number.parseFloat(v);
    assert(Number.isNaN(num) === false, `Invalid ${k} value: ${v}`);
    return num;
  },
  boolean: (v: string, k: string) => v.toLowerCase() === 'true',
  string: (v: string, k: string) => v,
};

export interface MergeEnvOptions {
  prefix?: string;
  separator?: string;
}

export interface ConfOptions {
  config: Record<string, any>;
  mergeEnvOptions?: MergeEnvOptions;
}

function mergeEnv(obj: Record<string, any>, { prefix = '', separator = '__' }: MergeEnvOptions) {
  if (obj === null) return;

  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 如果是对象，递归处理
      mergeEnv(value, {
        prefix: `${prefix ? `${prefix.toUpperCase()}${separator}` : ''}${key}`,
        separator,
      });
    } else if (Array.isArray(value)) {
      // 如果是数组，遍历每个元素并递归处理
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          mergeEnv(item, {
            prefix: `${prefix ? `${prefix.toUpperCase()}${separator}` : ''}${key}${separator}${index}`,
            separator,
          });
        } else {
          const envKey = `${prefix ? `${prefix.toUpperCase()}${separator}` : ''}${snakify(key).toUpperCase()}${separator}${index}`;
          if (process.env[envKey] !== undefined) {
            let basicType: string = typeof item;
            if (basicType === 'number') {
              if (Number.isInteger(item)) {
                basicType = 'integer';
              } else {
                basicType = 'float';
              }
            }

            const parse = parsers[basicType];
            if (parse) {
              value[index] = parse(process.env[envKey], envKey);
            } else {
              value[index] = process.env[envKey];
            }
          }
        }
      });
    } else {
      const envKey = `${prefix ? `${prefix.toUpperCase()}${separator}` : ''}${snakify(key).toUpperCase()}`;
      if (process.env[envKey] !== undefined) {
        let basicType: string = typeof value;
        if (basicType === 'number') {
          if (Number.isInteger(value)) {
            basicType = 'integer';
          } else {
            basicType = 'float';
          }
        }

        const parse = parsers[basicType];
        if (parse) {
          obj[key] = parse(process.env[envKey], envKey);
        } else {
          obj[key] = process.env[envKey];
        }
      }
    }
  }
}

export class Conf {
  readonly #conf: Record<string, any>;

  constructor({ config, mergeEnvOptions }: ConfOptions) {
    const conf = { ...config };
    if (mergeEnvOptions) {
      mergeEnv(conf, mergeEnvOptions);
    }
    this.#conf = conf;
  }

  get<T>(key: string): T {
    const keys = key.split('.');
    let val = this.#conf;
    for (const k of keys) {
      val = val?.[k];
    }

    // Return a copy to prevent modification
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        return [...val] as unknown as T;
      } else {
        return { ...val } as unknown as T;
      }
    } else {
      return val;
    }
  }

  display() {
    console.log(JSON.stringify(this.#conf, null, 2));
  }
}
