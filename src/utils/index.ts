/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Source: https://github.com/facebook/docusaurus/blob/a308fb7c81832cca354192fe2984f52749441249/packages/docusaurus-theme-common/src/utils/generalUtils.ts
// Context: https://github.com/typesense/docusaurus-theme-search-typesense/issues/27#issuecomment-1415757477

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { PluginOptions } from '../options';

export { GuestAuthProvider, useGuestAuth, useGuestAuthOptional, applyGuestAuth } from './guestAuth';

/**
 * Formats the page's title based on relevant site config and other contexts.
 */
export function useTitleFormatter(title?: string | undefined): string {
  const { siteConfig } = useDocusaurusContext();
  const { title: siteTitle, titleDelimiter } = siteConfig;
  return title?.trim().length ? `${title.trim()} ${titleDelimiter} ${siteTitle}` : siteTitle;
}

export function useGleanConfig(): { options: PluginOptions } {
  const { options } = usePluginData('docusaurus-plugin-search-glean') as { options: PluginOptions };

  return { options };
}
