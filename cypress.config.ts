import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  env: {
    TEST_EMAIL: "cypress_testing@email.com",
		TEST_PASSWORD: "aa5a3671-b39e-4e8b-87af-077467cb722f",
		TEST_USER_ID: "a5v885wvVKVOtjjEkOCqKbbAGq82",
		TEST_BUDGET_ID: "cypress_mock_6a52cd1a-886e-4f1d-9222-4e524792125f"
  }
});
