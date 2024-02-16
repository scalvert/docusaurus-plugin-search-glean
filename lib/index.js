"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@docusaurus/utils");
function searchGlean(context) {
    const { baseUrl, siteConfig: { themeConfig }, } = context;
    const { glean: { searchPagePath }, } = themeConfig;
    return {
        name: 'docusaurus-plugin-search-glean',
        getThemePath() {
            return '../lib/theme';
        },
        getTypeScriptThemePath() {
            return '../src/theme';
        },
        contentLoaded({ actions: { addRoute } }) {
            if (searchPagePath) {
                addRoute({
                    path: (0, utils_1.normalizeUrl)([baseUrl, searchPagePath]),
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
exports.default = searchGlean;
