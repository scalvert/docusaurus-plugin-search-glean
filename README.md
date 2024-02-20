# docusarus-plugin-search-glean

A Docusarus plugin to integrate Glean search into your Docusaurus site.

## Installation

```bash
npm install docusaurus-plugin-search-glean
```

or

```bash
yarn add docusaurus-plugin-search-glean
```

## Usage

Add this plugin to the `plugins` array in `docusaurus.config.js`.

```js
module.exports = {
  // ...
  plugins: [require.resolve("docusaurus-plugin-search-glean")],

  // or, if you want to specify options:

  // ...
  plugins: [
    [
      require.resolve("docusaurus-plugin-search-glean"),
      {
        // Options
      },
    ],
  ],
};
```