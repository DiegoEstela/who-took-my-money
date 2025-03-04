import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    parser: "@typescript-eslint/parser", // ✅ Asegura que usa el parser de TypeScript
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // ✅ Reglas recomendadas de TypeScript
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint, // ✅ Asegura que ESLint usa TypeScript
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "off", // ✅ Ahora permite el uso de "any"
      "@typescript-eslint/explicit-module-boundary-types": "warn", // ⚠️ Opcionalmente, puedes permitir funciones sin tipo de retorno explícito
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ], // ⚠️ Ignora variables con prefijo "_"
    },
  }
);
