import { normalizeUrl } from '@docusaurus/utils';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { PluginOptions, DEFAULT_PLUGIN_OPTIONS } from './options';

export default function searchGlean(context: LoadContext, options: PluginOptions): Plugin<void> {
  const { baseUrl } = context;

  options = { ...DEFAULT_PLUGIN_OPTIONS, ...options };

  return {
    name: 'docusaurus-plugin-search-glean',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    contentLoaded({ actions: { addRoute } }) {
      if (options.chatOptions) {
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
              src: options.sdkUrl,
            },
          },
        ],
      };
    },
  };
}

export { validateOptions } from './options';
