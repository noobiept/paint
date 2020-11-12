module.exports = {
    root: true,
    env: {
        node: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    rules: {
        "no-var": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-this-alias": "warn",
        "prefer-const": "warn",
    },
};
