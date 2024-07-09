module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    'prettier',
  ],

  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },

  rules: {
    'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "@vue/typescript",
  ],
};
