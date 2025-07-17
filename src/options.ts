import * as Joi from 'joi';
import type { OptionValidationContext } from '@docusaurus/types';
import mergeWith from 'lodash/mergeWith';
import {
  ModalSearchOptionsSchema,
  ChatOptionsSchema,
  type TypedModalSearchOptions,
  type TypedChatOptions,
} from './schemas';

export type PluginOptions = {
  searchOptions: Partial<TypedModalSearchOptions> | false;
  chatOptions: Partial<TypedChatOptions> | false;
  chatPagePath: string;
  enableAnonymousAuth: boolean;
};

export type Options = Partial<PluginOptions>;

export const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
  searchOptions: {},
  chatOptions: {},
  chatPagePath: 'chat',
  enableAnonymousAuth: false,
};

export function arrayMerger(objValue: unknown[], srcValue: unknown[]): unknown[] | undefined {
  return Array.isArray(objValue) ? objValue.concat(srcValue) : undefined;
}

export function normalizePluginOptions(...options: Partial<Options>[]): PluginOptions {
  return mergeWith({}, DEFAULT_PLUGIN_OPTIONS, ...options, arrayMerger);
}

const PluginOptionsSchema = Joi.object({
  searchOptions: Joi.alternatives()
    .try(ModalSearchOptionsSchema, Joi.boolean().valid(false))
    .default(DEFAULT_PLUGIN_OPTIONS.searchOptions),
  chatOptions: Joi.alternatives()
    .try(ChatOptionsSchema, Joi.boolean().valid(false))
    .default(DEFAULT_PLUGIN_OPTIONS.chatOptions),
  chatPagePath: Joi.string().default(DEFAULT_PLUGIN_OPTIONS.chatPagePath),
  enableAnonymousAuth: Joi.boolean().default(DEFAULT_PLUGIN_OPTIONS.enableAnonymousAuth),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(PluginOptionsSchema, options);
}
