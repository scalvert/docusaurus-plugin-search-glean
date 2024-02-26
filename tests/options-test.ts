import { describe, it, expect } from 'vitest';
import { normalizePluginOptions } from '@docusaurus/utils-validation';
import { validateOptions, Options, PluginOptions } from '../src/options';
import { Validate } from '@docusaurus/types';

function testValidateOptions(options: Options) {
  return validateOptions({
    validate: normalizePluginOptions as Validate<Options, PluginOptions>,
    options,
  });
}

describe('PluginOptions validation', () => {
  it('throws for undefined options', () => {
    // @ts-expect-error: TS should error
    expect(() => testValidateOptions(undefined)).toThrowErrorMatchingInlineSnapshot(`[ValidationError: "sdkUrl" is required]`);
  });

  it('throws for null options', () => {
    // @ts-expect-error: TS should error
    expect(() => testValidateOptions(null)).toThrowErrorMatchingInlineSnapshot(`[ValidationError: "value" must be of type object]`);
  });

  it('validates missing sdkUrl', () => {
    const options = {} as unknown as Options;
    expect(() => testValidateOptions(options)).toThrowErrorMatchingInlineSnapshot(`[ValidationError: "sdkUrl" is required]`);
  });

  it('validates sdkUrl format', () => {
    const options = { sdkUrl: 'not-a-valid-url' };
    expect(() => testValidateOptions(options)).toThrowErrorMatchingInlineSnapshot(`[ValidationError: "sdkUrl" must be a valid uri]`);
  });

  it('validates partial searchOptions without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      searchOptions: { key: 'test' },
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      searchOptions: expect.any(Object),
    });
  });

  it('validates partial chatOptions without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      chatOptions: { agent: 'agent_id' },
    };
    expect(testValidateOptions(options)).toMatchObject({
      sdkUrl: expect.any(String),
      chatOptions: expect.any(Object),
    });
  });

  it('allows all valid options without throwing', () => {
    const options = {
      sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
      searchOptions: {
        key: 'testKey',
        onSearch: () => console.log('Search initiated'),
      },
      chatOptions: {
        agent: 'agent_id',
        onChat: (chatId?: number) => console.log(`Chat initiated with ID: ${chatId}`),
      },
    };
    expect(() => testValidateOptions(options)).not.toThrow();
  });
});
