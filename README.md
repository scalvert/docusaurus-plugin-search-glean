# docusarus-plugin-search-glean

A Docusarus plugin to integrate Glean search into your Docusaurus site.

## Description

This plugin utilizes Glean's SDK to enable both Glean search and AI Agent chat into your documentation. It is a drop-in replacement for the default Docusaurus search plugin.

## Features

### Glean Search

Enables you to integrate Glean's search into your Docusaurus site.

![Glean Search](./img/glean-search.png)

### Glean Chat (AI Agent)

Enables you to integrate Glean's AI Agent chat into your Docusaurus site (requires setting up an AI Agent in Glean).

![Glean Chat](./img/glean-chat.png)

## Installation

```bash
npm install docusaurus-plugin-search-glean
```

or

```bash
yarn add docusaurus-plugin-search-glean
```

## Search Configuration

The search feature integrates Glean's search functionality into your Docusaurus site. You can configure search independently of the chat feature.

### Basic Plugin Setup for Search

Add the plugin to your `docusaurus.config.js` with search options:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        searchOptions: {
          // Search configuration options
        },
      },
    ],
  ],
};
```

### Static Search Configuration

If your documentation doesn't change often, use statically configured search options:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        searchOptions: {
          filters: [
            { key: 'app', value: 'github' },
            { key: 'type', value: 'page' },
            { key: 'repository', value: '<your repository name>' },
          ],
        },
      },
    ],
  ],
};
```

Any changes to the docusaurus site will be automatically picked up by Glean and the search content will be updated accordingly.

### Dynamic Search Configuration with Collections

If your documentation changes often, utilize Glean **collections** to dynamically configure search. While this approach is more complex, it ensures that the search configuration is always up-to-date with the current state of your documentation.

To achieve this, you will need to create a Glean collection for your documentation:

1. Create a new Glean collection in the Glean UI.
2. Create an automated collections sync using GitHub Actions workflows and the [Glean Collections Sync](https://github.com/scalvert/glean-collections-sync) action.

Example configuration:

`docusaurus.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        searchOptions: {
          filters: [{ key: 'collection', value: '<collection name>' }],
        },
      },
    ],
  ],
};
```

`glean-collections-sync.yml`:

```yml
name: Sync Collections

on:
  schedule:
    - cron: '0 0 * * *' # Runs every day at midnight UTC
  workflow_dispatch: # Allows for manual triggering

jobs:
  sync_collections:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Sync collections
        uses: scalvert/glean-collections-sync@v1
        with:
          glean-client-api-url: ${{ secrets.GLEAN_CLIENT_API_URL }}
          glean-client-api-token: ${{ secrets.GLEAN_CLIENT_API_TOKEN }}
          glean-user-email: ${{ secrets.GLEAN_USER_EMAIL }}
          collection-sync-configs: '[{"name": "<collection name>", "query": "<collection query>", "filters": "<collection filters>"}]'
```

## Chat Configuration

The chat feature integrates Glean's AI Agent chat into your Docusaurus site. You can configure chat independently of the search feature.

### Basic Plugin Setup for Chat

Add the plugin to your `docusaurus.config.js` with chat options:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        chatOptions: {
          agentId: 'your-glean-agent-id',
        },
      },
    ],
  ],
};
```

> **Note:** The `agentId` property replaces the legacy `applicationId` property. While `applicationId` is still supported for backward compatibility, it will be deprecated in the future. We recommend using `agentId` for new implementations.

### Static Chat Configuration

If your documentation doesn't change often, use statically configured chat options:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        chatOptions: {
          agentId: 'your-glean-agent-id',
        },
      },
    ],
  ],
};
```

**Note:** Changes to the site will **not** automatically update the knowledge sources for the Glean Agent - those changes must be made manually in Glean.

### Dynamic Chat Configuration with Collections

For frequently changing documentation, use Glean **collections** to configure chat. The Agent's Knowledge Sources should be configured to use the collection.

Example configuration:

`docusaurus.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        chatOptions: {
          agentId: 'your-glean-agent-id', // The Agent's Knowledge Sources should be configured to use the collection
        },
      },
    ],
  ],
};
```

Follow the same collections sync setup as described in the [Dynamic Search Configuration](#dynamic-search-configuration-with-collections) section.

### Making the Chat Page Accessible

When the chat feature is enabled, the plugin automatically creates a dedicated chat page (default path: `/chat`). However, **the plugin does not automatically add navigation links**. You need to manually add navigation elements to help users discover and access the chat functionality.

#### Option 1: Add a Navbar Link

Add a link to the chat page in your site's navigation bar by updating the `navbar.items` array in `docusaurus.config.js`:

```js
module.exports = {
  // ...
  themeConfig: {
    navbar: {
      items: [
        // ... your existing navbar items
        {
          label: 'Chat',
          to: '/chat', // Use the same path as your chatPagePath option
          position: 'right',
        },
      ],
    },
  },
};
```

#### Option 2: Add a Sidebar Link

If you prefer to add the chat link to a sidebar, you can include it in your sidebar configuration:

```js
// sidebars.js
module.exports = {
  tutorialSidebar: [
    // ... your existing sidebar items
    {
      type: 'link',
      label: 'Chat',
      href: '/chat', // Use the same path as your chatPagePath option
    },
  ],
};
```

#### Custom Chat Page Path

If you've configured a custom `chatPagePath` in your plugin options, make sure to use the same path in your navigation links:

```js
// Plugin configuration
[
  require.resolve('docusaurus-plugin-search-glean'),
  {
    chatPagePath: 'ai-assistant', // Custom path
    chatOptions: {
      agentId: 'your-glean-agent-id',
    },
  },
],

// Navbar link should match
{
  label: 'AI Assistant',
  to: '/ai-assistant', // Match your custom chatPagePath
  position: 'right',
}
```

## Using Both Features Together

You can enable both search and chat features simultaneously by providing both `searchOptions` and `chatOptions`:

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve('docusaurus-plugin-search-glean'),
      {
        searchOptions: {
          filters: [
            { key: 'app', value: 'github' },
            { key: 'type', value: 'page' },
            { key: 'repository', value: '<your repository name>' },
          ],
        },
        chatOptions: {
          agentId: 'your-glean-agent-id',
        },
      },
    ],
  ],
};
```

## Options

| Property              | Type                                   | Description                                                               |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| `searchOptions`       | `Partial<ModalSearchOptions> \| false` | Options for search functionality. Pass `false` to disable.                |
| `chatOptions`         | `Partial<ChatOptions> \| false`        | Options for chat functionality. Pass `false` to disable.                  |
| `chatPagePath`        | `string`                               | Path to the chat page within the application.                             |
| `enableAnonymousAuth` | `boolean`                              | If true, the plugin will fetch guest authentication tokens automatically. |

For more information on the search and chat options, refer to the [Glean documentation](https://developers.glean.com/docs/browser_api/).
