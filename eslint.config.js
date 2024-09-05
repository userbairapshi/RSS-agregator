import airbnbBase from "eslint-config-airbnb-base";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      "no-trailing-spaces": "error",
      "semi": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
];



