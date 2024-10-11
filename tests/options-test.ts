import { describe, test, expect } from 'vitest';
import { normalizePluginOptions as externalNormalizePluginOptions } from '@docusaurus/utils-validation';
import {
  validateOptions,
  Options,
  PluginOptions,
  DEFAULT_PLUGIN_OPTIONS,
  normalizePluginOptions,
} from '../src/options';
import { Validate } from '@docusaurus/types';

function testValidateOptions(options: Options) {
  return validateOptions({
    validate: externalNormalizePluginOptions as Validate<Options, PluginOptions>,
    options,
  });
}

describe('PluginOptions validation', () => {
  test('throws for null options', () => {
    // @ts-expect-error: TS should error
    expect(() => testValidateOptions(null)).toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: "value" must be of type object]`,
    );
  });

  test('validates sdkUrl format', () => {
    const options = { sdkUrl: 'not-a-valid-url' };
    expect(() => testValidateOptions(options)).toThrowErrorMatchingInlineSnapshot(
      `[ValidationError: "sdkUrl" must be a valid uri]`,
    );
  });

  test('validates partial searchOptions without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      searchOptions: { key: 'test' },
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      searchOptions: expect.any(Object),
    });
  });

  test('validates searchOptions can be false without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      searchOptions: false as const,
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      searchOptions: false,
    });
  });

  test('validates partial chatOptions without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      chatOptions: { agent: 'agent_id' },
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      chatOptions: expect.any(Object),
    });
  });

  test('validates chatOptions can be false without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      chatOptions: false as const,
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      chatOptions: false,
    });
  });

  test('allows all valid options without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      searchOptions: {
        key: 'testKey',
        onSearch: () => console.log('Search initiated'),
      },
      chatOptions: {
        agent: 'agent_id',
        onChat: (chatId?: string) => console.log(`Chat initiated with ID: ${chatId}`),
      },
    };
    expect(() => testValidateOptions(options)).not.toThrow();
  });
});

describe('PluginOptions normalization', () => {
  test('normalizePluginOptions - no options provided', () => {
    const result = normalizePluginOptions({});
    expect(result).toEqual(DEFAULT_PLUGIN_OPTIONS);
  });

  test('normalizePluginOptions - partial options provided', () => {
    const options = { sdkUrl: 'https://app.glean.com/embedded-search-v2.min.js' };
    const result = normalizePluginOptions(options);
    expect(result).toEqual({ ...DEFAULT_PLUGIN_OPTIONS, ...options });
  });

  test('normalizePluginOptions - all options provided', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-v2.min.js',
      searchOptions: {
        filters: [
          { key: 'app', value: 'github' },
          { key: 'type', value: 'issue' },
        ],
      },
      chatOptions: { chatId: 'chat_id' },
      chatPagePath: 'chat-v2',
    };
    const result = normalizePluginOptions(options);
    expect(result).toEqual(options);
  });

  test('normalizePluginOptions - extra options provided', () => {
    const options = {
      ...DEFAULT_PLUGIN_OPTIONS,
      sdkUrl: 'https://app.glean.com/embedded-search-v2.min.js',
      extraOption: 'extraValue',
    };
    const result = normalizePluginOptions(options);
    expect(result).toEqual(options);
  });
});
