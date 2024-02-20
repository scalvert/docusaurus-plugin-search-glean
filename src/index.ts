import type { LoadContext, Plugin } from '@docusaurus/types';

export default function searchGlean(context: LoadContext): Plugin<void> {
  return {
    name: 'docusaurus-plugin-search-glean',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
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
