/**
 * Joi validation schemas for @gleanwork/web-sdk types.
 *
 * This module provides Joi schemas that mirror the TypeScript interfaces from @gleanwork/web-sdk.
 * The schemas are organized in a modular way to reduce duplication and improve maintainability.
 *
 * Key benefits:
 * - TypeScript imports ensure we stay in sync with the SDK's type definitions
 * - Modular composition reduces duplication (e.g., baseOptionsSchema)
 * - Clear separation between validation logic and type definitions
 *
 * To maintain sync with SDK updates:
 * 1. TypeScript compiler will catch breaking changes when SDK types change
 * 2. Run `yarn schema:check` to validate type compatibility
 * 3. Update schemas as needed when new SDK versions are released
 *
 * @see {@link https://developers.glean.com/docs/browser_api/} Glean Browser API docs
 */

import * as Joi from 'joi';
import type { ModalSearchOptions, ChatOptions, AuthTokenDetails } from '@gleanwork/web-sdk';

export const AuthTokenDetailsSchema = Joi.object({
  expirationTime: Joi.number().required(),
  token: Joi.string().required(),
});

export const BoxCustomizationsSchema = Joi.object({
  border: Joi.string().optional(),
  borderRadius: Joi.number().optional(),
  boxShadow: Joi.string().optional(),
  horizontalMargin: Joi.number().optional(),
  verticalMargin: Joi.number().optional(),
});

export const ThemeSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(Joi.string(), Joi.number()),
);

export const ChatCustomizationsSchema = Joi.object({
  container: BoxCustomizationsSchema.optional(),
  features: Joi.object({
    agentLibrary: Joi.boolean().optional(),
    applicationLibrary: Joi.boolean().optional(),
    chatMenu: Joi.boolean().optional(),
    chatSettings: Joi.boolean().optional(),
    clearChat: Joi.boolean().optional(),
    createPrompt: Joi.boolean().optional(),
    feedback: Joi.boolean().optional(),
    newChatButton: Joi.boolean().optional(),
    promptLibrary: Joi.boolean().optional(),
  }).optional(),
});

export const FilterValueSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.string().required(),
});

const baseOptionsSchema = Joi.object({
  authMethod: Joi.string().valid('sso', 'token').optional(),
  authToken: AuthTokenDetailsSchema.optional(),
  backend: Joi.string().optional(),
  disableAnalytics: Joi.boolean().optional(),
  disableAssistant: Joi.boolean().optional(),
  domainsToOpenInCurrentTab: Joi.array().items(Joi.string()).optional(),
  enable3PCookieAccessRequest: Joi.boolean().optional(),
  enableActivityLogging: Joi.boolean().optional(),
  fontFaces: Joi.array()
    .items(
      Joi.object({
        family: Joi.string().required(),
        url: Joi.string().required(),
        variationSettings: Joi.string().optional(),
        weight: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
      }),
    )
    .optional(),
  fontFamily: Joi.string().optional(),
  fontSize: Joi.string().valid('medium', 'large', 'larger').optional(),
  key: Joi.string().optional(),
  locale: Joi.string().optional(),
  onAuthTokenRequired: Joi.function().optional(),
  theme: Joi.object().pattern(Joi.string(), ThemeSchema).optional(),
  themeVariant: Joi.string().valid('light', 'dark', 'auto').optional(),
  unauthorizedMessage: Joi.string().optional(),
  urlsToOpenInCurrentTab: Joi.array().items(Joi.string()).optional(),
  webAppUrl: Joi.string().optional(),
});

const searchOptionsSchema = baseOptionsSchema.keys({
  datasource: Joi.string().optional(),
  datasourcesFilter: Joi.array().items(Joi.string()).optional(),
  filters: Joi.array().items(FilterValueSchema).optional(),
  hideAutocomplete: Joi.boolean().optional(),
  onChat: Joi.function().optional(),
  onSearch: Joi.function().optional(),
  query: Joi.string().optional(),
});

export const ModalSearchOptionsSchema = searchOptionsSchema.keys({
  onDetach: Joi.function().optional(),
  showNativeSearchToggle: Joi.boolean().optional(),
});

export const ChatOptionsSchema = baseOptionsSchema.keys({
  agent: Joi.string().valid('DEFAULT', 'GPT').optional(),
  agentId: Joi.string().optional(),
  applicationId: Joi.string().optional(),
  chatId: Joi.string().optional(),
  customizations: ChatCustomizationsSchema.optional(),
  initialMessage: Joi.string().optional(),
  landingPage: Joi.string().valid('chat', 'agentLibrary').optional(),
  onChat: Joi.function().optional(),
  onSearch: Joi.function().optional(),
  promptId: Joi.string().optional(),
  restrictToApplication: Joi.boolean().optional(),
  source: Joi.string().optional(),
});

export type TypedModalSearchOptions = ModalSearchOptions;
export type TypedChatOptions = ChatOptions;
export type TypedAuthTokenDetails = AuthTokenDetails;
