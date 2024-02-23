import { normalizeUrl } from '@docusaurus/utils';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { ThemeConfig } from './types';

export default function searchGlean(context: LoadContext): Plugin<void> {
  const {
    baseUrl,
    siteConfig: { themeConfig },
  } = context;
  const {
    glean: { chatOptions },
  } = themeConfig as ThemeConfig;

  return {
    name: 'docusaurus-plugin-search-glean',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    contentLoaded({ actions: { addRoute } }) {
      if (chatOptions) {
        addRoute({
          path: normalizeUrl([baseUrl, 'chat']),
          component: '@theme/ChatPage',
          exact: true,
        });
      }
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              async: true,
              src: 'https://app.glean.com/embedded-search-latest.min.js',
            },
          },
        ],
      };
    },
  };
}
