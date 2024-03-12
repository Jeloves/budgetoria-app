const path = require('path');

module.exports = {
  stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],

  env: (config) => ({
    ...config,
    // ensure that new next/link is enabled in storybook
    // required for sidebar navigation stories
    __NEXT_NEW_LINK_BEHAVIOR: true,
  }),

  webpackFinal: async (config) => {
    config.resolve.alias["next/router"] = require.resolve(
      "../__mocks__/next/router.tsx",
    );
    config.resolve.alias["@styles"] = path.resolve("./styles");
    return config;
  },
};