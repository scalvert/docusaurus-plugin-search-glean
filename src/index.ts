import {normalizeUrl} from '@docusaurus/utils';

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {ThemeConfig} from 'docusaurus-plugin-search-glean';

export default function searchGlean(context: LoadContext): Plugin<void> {
  const {
    baseUrl,
    siteConfig: {title, url, favicon, themeConfig},
  } = context;
  const {
    glean: {searchPagePath},
  } = themeConfig as ThemeConfig;

  return {
    name: 'docusaurus-plugin-search-glean',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    contentLoaded({actions: {addRoute}}) {
      if (searchPagePath) {
        addRoute({
          path: normalizeUrl([baseUrl, searchPagePath]),
          component: '@theme/SearchPage',
          exact: true,
        });
      }
    },

    injectHtmlTags() {
      if (!searchPagePath) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: 'https://app.glean.com/embedded-search-latest.min.js',
            },
          },
        ],
      };
    },
  };
}
