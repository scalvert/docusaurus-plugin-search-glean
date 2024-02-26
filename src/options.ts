import Joi from 'joi';
import type { OptionValidationContext } from '@docusaurus/types';
import { ChatOptions, ModalSearchOptions } from './types';

const AuthTokenDetailsSchema = Joi.object({
  expirationTime: Joi.number().required(),
  token: Joi.string().required(),
});

const BoxCustomizationsSchema = Joi.object({
  border: Joi.string(),
  borderRadius: Joi.number(),
  boxShadow: Joi.string(),
  horizontalMargin: Joi.number(),
  verticalMargin: Joi.number(),
});

const ThemeSchema = Joi.object().pattern(Joi.string(), [Joi.string(), Joi.number()]);

const ChatCustomizationsSchema = Joi.object({
  container: BoxCustomizationsSchema,
});

const commonOptionsSchema = Joi.object({
  authToken: AuthTokenDetailsSchema,
  backend: Joi.string(),
  disableAnalytics: Joi.boolean(),
  domainsToOpenInCurrentTab: Joi.array().items(Joi.string()),
  enableActivityLogging: Joi.boolean(),
  key: Joi.string(),
  locale: Joi.string(),
  onAuthTokenRequired: Joi.function(),
  theme: Joi.object().pattern(Joi.string(), ThemeSchema),
  themeVariant: Joi.string().valid('light', 'dark', 'auto'),
  urlsToOpenInCurrentTab: Joi.array().items(Joi.string()),
  webAppUrl: Joi.string(),
});

const ModalSearchOptionsSchema = commonOptionsSchema.keys({
  datasource: Joi.string(),
  datasourcesFilter: Joi.array().items(Joi.string()),
  hideAutocomplete: Joi.boolean(),
  onChat: Joi.function(),
  onDetach: Joi.function(),
  onSearch: Joi.function().required(),
  query: Joi.string(),
  showNativeSearchToggle: Joi.boolean(),
});

const ChatOptionsSchema = commonOptionsSchema.keys({
  agent: Joi.string(),
  applicationId: Joi.string(),
  chatId: Joi.string(),
  customizations: ChatCustomizationsSchema,
  initialMessage: Joi.string(),
  onChat: Joi.function(),
  onSearch: Joi.function(),
  source: Joi.string(),
});

const PluginOptionsSchema = Joi.object({
  sdkUrl: Joi.string().uri().default('https://app.glean.com/embedded-search-latest.min.js'),
  searchOptions: ModalSearchOptionsSchema.default({}),
  chatOptions: ChatOptionsSchema.default({}),
});

export type PluginOptions = {
  sdkUrl: string;
  searchOptions: Partial<ModalSearchOptions>;
  chatOptions: Partial<ChatOptions>;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
  sdkUrl: 'https://app.glean.com/embedded-search-latest.min.js',
  searchOptions: {},
  chatOptions: {},
};

export function validateOptions({
  validate,
  options: userOptions,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  let options = userOptions;

  const normalizedOptions = validate(PluginOptionsSchema, options);

  return normalizedOptions;
}
