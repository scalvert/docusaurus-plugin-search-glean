module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`
        project: './tsconfig.json', // Adjust this path if necessary
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: [
        'src/theme/Chat/index.tsx',
        'src/theme/ChatPage/index.tsx',
        'src/theme/SearchBar/index.tsx',
        'src/utils/index.ts',
        'src/hooks/useGleanSDK.ts',
        'src/utils/guestAuth.tsx',
        'src/hooks/useThemeChange.ts',
      ],
      rules: {
        'import/no-unresolved': [
          'error',
          {
            ignore: [
              '@docusaurus/useGlobalData',
              '@theme/Layout',
              '@docusaurus/useDocusaurusContext',
              '@docusaurus/BrowserOnly',
              '@docusaurus/useIsBrowser',
            ],
          },
        ],
      },
    },
  ],
};
