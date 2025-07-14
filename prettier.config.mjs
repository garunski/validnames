/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tailwindFunctions: ["clsx", "tw"],
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/tailwind.css",
};

export default config;
