import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Conf } from './index';

describe('Conf', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return env variables if env options are provided', () => {
    vi.stubEnv('MOCK__SERVER__PORT', '6666');
    vi.stubEnv('MOCK__SERVER__BASE_PATH', '/mockpath');
    vi.stubEnv('MOCK__LOGS__0__LEVEL', 'custom');
    vi.stubEnv('MOCK__NUMS__0', '8');

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
        nums: [1, 2, 3],
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
    expect(conf.get('nums.0')).toBe(8);
    expect(conf.get('nums.1')).toBe(2);
  });

  it('should return env variables if env options are provided', () => {
    vi.stubEnv('MOCK::SERVER::PORT', '6666');
    vi.stubEnv('MOCK::SERVER::BASE_PATH', '/mockpath');
    vi.stubEnv('MOCK::LOGS::0::LEVEL', 'custom');
    vi.stubEnv('MOCK::NUMS::0', '8');

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
        nums: [1, 2, 3],
      },
      mergeEnvOptions: {
        prefix: 'MOCK',
        separator: '::',
      },
    });

    expect(conf.get('name')).toBe('mock');
    expect(conf.get('server.port')).toBe(6666);
    expect(conf.get('server.basePath')).toBe('/mockpath');
    expect(conf.get('server')).toEqual({ port: 6666, basePath: '/mockpath' });
    expect(conf.get('logs.0.level')).toBe('custom');
    expect(conf.get('logs.0')).toEqual({ level: 'custom', output: 'console' });
    expect(conf.get('nums.0')).toBe(8);
    expect(conf.get('nums.1')).toBe(2);
  });

  it('should return initial value if env options are not provided', () => {
    const conf = new Conf({
      config: {
        name: 'original',
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
    });

    expect(conf.get('name')).toBe('original');
    expect(conf.get('server.port')).toBe(8080);
    expect(conf.get('server.basePath')).toBe('/api');
    expect(conf.get('server')).toEqual({ port: 8080, basePath: '/api' });
    expect(conf.get('logs.0.level')).toBe('info');
    expect(conf.get('logs.0')).toEqual({ level: 'info', output: 'console' });
  });

  it('should return undefined for non-exist key', () => {
    const conf = new Conf({
      config: {
        name: 'original',
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
    });
    expect(conf.get('notexist')).toBeUndefined();
    expect(conf.get('not.exist')).toBeUndefined();
  });
});
