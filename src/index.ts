import merge from 'lodash/merge';
import { normalizeUrl } from '@docusaurus/utils';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { Options, normalizePluginOptions } from './options';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function searchGlean(context: LoadContext, options: Options): Plugin<void> {
  const { baseUrl } = context;
  const { siteConfig } = useDocusaurusContext();

  options = normalizePluginOptions(
    merge(options, {
      initialFilters: [
        { key: 'repository', value: `${siteConfig.organizationName}/${siteConfig.projectName}` },
      ],
    }),
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

      if (!options.chatOptions) return;

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
