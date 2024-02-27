# docusarus-plugin-search-glean

A Docusarus plugin to integrate Glean search into your Docusaurus site.

## Description

This plugin utilizes Glean's JS SDK to enable both Glean search and AI App chat into your documentation. It is a drop-in replacement for the default Docusaurus search plugin.

## Features

### Glean Search

Enables you to integrate Glean's search into your Docusaurus site.

![Glean Search](./img/glean-search.png)

## Glean Chat (AI App)

Enables you to integrate Glean's AI App chat into your Docusaurus site (requires setting up an AI App in Glean).

![Glean Chat](./img/glean-chat.png)

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
  plugins: [require.resolve("docusaurus-plugin-search-glean"), {}],

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

### Example

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve("docusaurus-plugin-search-glean"),
      {
        sdkUrl: "https://app.glean.com/embedded-search-latest.min.js",
        searchOptions: {
          datasourcesFilter: ["github"],
        },
        chatOptions: {
          applicationId: "your-glean-app-id",
        },
        chatPagePath: "chat",
      },
    ],
  ],
};
```

### Options

| Property        | Type                                   | Description                                                |
| --------------- | -------------------------------------- | ---------------------------------------------------------- |
| `sdkUrl`        | `string`                               | URL to the SDK required for the plugin.                    |
| `searchOptions` | `Partial<ModalSearchOptions> \| false` | Options for search functionality. Pass `false` to disable. |
| `chatOptions`   | `Partial<ChatOptions> \| false`        | Options for chat functionality. Pass `false` to disable.   |
| `chatPagePath`  | `string`                               | Path to the chat page within the application.              |

For more information on the search and chat options, refer to the [Glean documentation](https://developers.glean.com/docs/browser_api/).