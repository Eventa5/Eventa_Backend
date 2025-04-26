module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [0],
    "type-empty": [0],
    "subject-empty": [0],
    "custom-header-format": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "custom-header-format": (parsed) => {
          const { header } = parsed;
          const pattern = /^(feat|fix|docs|style|refactor|test|chore): .+$/;
          if (!pattern.test(header)) {
            return [
              false,
              "Commit message format error, please use the format type: message, for example chore: add commitlint rules",
            ];
          }
          return [true];
        },
      },
    },
  ],
};
