import { afterEach, describe, expect, it, vi } from 'vitest';
import { Conf } from './index';

describe('Conf', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should equal to value parse from env', () => {
    vi.stubEnv('MOCK__SERVER__PORT', '6666');
    vi.stubEnv('MOCK__SERVER__BASE_PATH', '/mockpath');
    vi.stubEnv('MOCK__LOGS__0__LEVEL', 'custom');

    const conf = new Conf({
      config: {
        name: 'mock',
        server: {
          port: 8080,
          basePath: '/api',
        },
        logs: [
          {
            level: 'info',
            output: 'console',
          },
        ],
      },
      mergeEnvOptions: {
        prefix: 'MOCK',
        separator: '__',
      },
    });

    expect(conf.get('name')).toBe('mock');
    expect(conf.get('server.port')).toBe(6666);
    expect(conf.get('server.basePath')).toBe('/mockpath');
    expect(conf.get('server')).toEqual({ port: 6666, basePath: '/mockpath' });
    expect(conf.get('logs.0.level')).toBe('custom');
    expect(conf.get('logs.0')).toEqual({ level: 'custom', output: 'console' });
  });
});
