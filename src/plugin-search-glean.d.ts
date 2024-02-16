declare module 'docusaurus-plugin-search-glean' {
  export type ThemeConfig = {
    glean: {
      applicationId: string;
      searchPagePath: string | false | null;
    };
  };
}
