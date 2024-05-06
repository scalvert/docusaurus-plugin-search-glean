import Joi from 'joi';
import type { OptionValidationContext } from '@docusaurus/types';
import { ChatOptions, ModalSearchOptions } from './types';
import mergeWith from 'lodash/mergeWith';

export type PluginOptions = {
  sdkUrl: string;
  searchOptions: Partial<ModalSearchOptions> | false;
  chatOptions: Partial<ChatOptions> | false;
  chatPagePath: string;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
  sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
  searchOptions: {
    datasourcesFilter: ['github'],
    initialFilters: [{ key: 'type', value: 'page' }],
  },
  chatOptions: {},
  chatPagePath: 'chat',
};

export function arrayMerger(objValue: any[], srcValue: any[]): any[] | undefined {
  return Array.isArray(objValue) ? objValue.concat(srcValue) : undefined;
}

export function normalizePluginOptions(...options: Partial<Options>[]): PluginOptions {
  return mergeWith({}, DEFAULT_PLUGIN_OPTIONS, ...options, arrayMerger);
}

const AuthTokenDetailsSchema = Joi.object({
  expirationTime: Joi.number().required(),
  token: Joi.string().required(),
});

const BoxCustomizationsSchema = Joi.object({
  border: Joi.string().optional(),
  borderRadius: Joi.number().optional(),
  boxShadow: Joi.string().optional(),
  horizontalMargin: Joi.number().optional(),
  verticalMargin: Joi.number().optional(),
});

const ThemeSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(Joi.string(), Joi.number()),
);

const ChatCustomizationsSchema = Joi.object({
  container: BoxCustomizationsSchema.optional(),
});

const commonOptionsSchema = Joi.object({
  authToken: AuthTokenDetailsSchema.optional(),
  backend: Joi.string().optional(),
  disableAnalytics: Joi.boolean().optional(),
  domainsToOpenInCurrentTab: Joi.array().items(Joi.string()).optional(),
  enableActivityLogging: Joi.boolean().optional(),
  key: Joi.string().optional(),
  locale: Joi.string().optional(),
  onAuthTokenRequired: Joi.function().optional(),
  theme: Joi.object().pattern(Joi.string(), ThemeSchema).optional(),
  themeVariant: Joi.string().valid('light', 'dark', 'auto').optional(),
  urlsToOpenInCurrentTab: Joi.array().items(Joi.string()).optional(),
  webAppUrl: Joi.string().optional(),
});

const ModalSearchOptionsSchema = commonOptionsSchema.keys({
  datasource: Joi.string().optional(),
  datasourcesFilter: Joi.array().items(Joi.string()).optional(),
  initialFilters: Joi.array().items(Joi.object()).optional(),
  hideAutocomplete: Joi.boolean().optional(),
  onChat: Joi.function().optional(),
  onDetach: Joi.function().optional(),
  onSearch: Joi.function().optional(),
  query: Joi.string().optional(),
  showNativeSearchToggle: Joi.boolean().optional(),
});

const ChatOptionsSchema = commonOptionsSchema.keys({
  agent: Joi.string().optional(),
  applicationId: Joi.string().optional(),
  chatId: Joi.string().optional(),
  customizations: ChatCustomizationsSchema.optional(),
  initialMessage: Joi.string().optional(),
  onChat: Joi.function().optional(),
  onSearch: Joi.function().optional(),
  source: Joi.string().optional(),
});

const PluginOptionsSchema = Joi.object({
  sdkUrl: Joi.string().uri().default(DEFAULT_PLUGIN_OPTIONS.sdkUrl),
  searchOptions: Joi.alternatives()
    .try(ModalSearchOptionsSchema, Joi.boolean().valid(false))
    .default(DEFAULT_PLUGIN_OPTIONS.searchOptions),
  chatOptions: Joi.alternatives()
    .try(ChatOptionsSchema, Joi.boolean().valid(false))
    .default(DEFAULT_PLUGIN_OPTIONS.chatOptions),
  chatPagePath: Joi.string().default(DEFAULT_PLUGIN_OPTIONS.chatPagePath),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(PluginOptionsSchema, options);
}
