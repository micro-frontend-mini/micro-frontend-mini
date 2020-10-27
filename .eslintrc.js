module.exports = {
  "extends": ["airbnb", "plugin:jest/recommended"],
  "parser": "babel-eslint",
  "plugins": [
    "react",
    "jest"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest/globals": true
  },
  "globals": {
    "location": true,
  },
  "rules": {
    // 允许提交 error 和 warn 输出，不允许提交 console.log
    "no-console": ["error", { "allow": ["warn", "error"] }]
  },
  'settings': {
    "import/resolver": {
      "webpack": {
        "config": "./webpack.dev.js"
      },
      alias: {
        map: [
          ['~', './src'],
        ],
      }
    },
  }
};
