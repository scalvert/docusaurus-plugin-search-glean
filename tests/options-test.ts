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

  test('validates partial searchOptions without throwing', () => {
    const options = {
      searchOptions: { key: 'test' },
    };
    expect(testValidateOptions(options)).toMatchObject({
      searchOptions: expect.any(Object),
    });
  });

  test('validates searchOptions can be false without throwing', () => {
    const options = {
      searchOptions: false as const,
    };
    expect(testValidateOptions(options)).toMatchObject({
      searchOptions: false,
    });
  });

  test('validates partial chatOptions without throwing', () => {
    const options = {
      chatOptions: { agent: 'DEFAULT' as const },
    };
    expect(testValidateOptions(options)).toMatchObject({
      chatOptions: expect.any(Object),
    });
  });

  test('validates chatOptions can be false without throwing', () => {
    const options = {
      chatOptions: false as const,
    };
    expect(testValidateOptions(options)).toMatchObject({
      chatOptions: false,
    });
  });

  test('validates enableAnonymousAuth without throwing', () => {
    const options = {
      enableAnonymousAuth: true,
    };
    expect(testValidateOptions(options)).toMatchObject({
      enableAnonymousAuth: true,
    });
  });

  test('allows all valid options without throwing', () => {
    const options = {
      searchOptions: {
        key: 'testKey',
        onSearch: () => console.log('Search initiated'),
      },
      chatOptions: {
        agent: 'DEFAULT' as const,
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
    const options = {};
    const result = normalizePluginOptions(options);
    expect(result).toEqual({ ...DEFAULT_PLUGIN_OPTIONS, ...options });
  });

  test('normalizePluginOptions - all options provided', () => {
    const options = {
      searchOptions: {
        filters: [
          { key: 'app', value: 'github' },
          { key: 'type', value: 'issue' },
        ],
      },
      chatOptions: { chatId: 'chat_id' },
      chatPagePath: 'chat-v2',
      enableAnonymousAuth: true,
    };
    const result = normalizePluginOptions(options);
    expect(result).toEqual(options);
  });

  test('normalizePluginOptions - extra options provided', () => {
    const options = {
      ...DEFAULT_PLUGIN_OPTIONS,
      extraOption: 'extraValue',
    };
    const result = normalizePluginOptions(options);
    expect(result).toEqual(options);
  });
});
