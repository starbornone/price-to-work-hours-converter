const js = require("@eslint/js");
const globals = require("globals");

// Classic-script extension files share globals via <script> tags / importScripts.
const classicScripts = [
  "background.js",
  "contentScript.js",
  "currency.js",
  "currencies.js",
  "exchangeCache.js",
  "storage.js",
  "ui.js",
  "popup.js",
];

module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: classicScripts,
    languageOptions: {
      globals: {
        importScripts: "readonly",
      },
    },
    rules: {
      // Cross-file globals from manifest / popup script order / importScripts.
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
