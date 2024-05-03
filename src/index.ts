import mergeWith from 'lodash/mergewith';
import { normalizeUrl } from '@docusaurus/utils';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { Options, normalizePluginOptions } from './options';

export default function searchGlean(context: LoadContext, options: Options): Plugin<void> {
  const { baseUrl, siteConfig } = context;

  if (!siteConfig.organizationName || !siteConfig.projectName) {
    throw new Error(
      'Missing organizationName or projectName in siteConfig. Please check your Docusaurus configuration.',
    );
  }

  options = normalizePluginOptions(
    {
      searchOptions: {
        initialFilters: [
          {
            key: 'repository',
            value: `${siteConfig.organizationName}/${siteConfig.projectName}`,
          },
        ],
      },
    },
    options,
  );

  return {
    name: 'docusaurus-plugin-search-glean',

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    contentLoaded({ actions: { addRoute, setGlobalData } }) {
      setGlobalData({ options });

      if (!options.chatOptions) {
        return;
      }

      if (options.chatPagePath) {
        addRoute({
          path: normalizeUrl([baseUrl, options.chatPagePath]),
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
