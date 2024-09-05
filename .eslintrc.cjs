module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaVersion": 15,
        "sourceType": "module"
    },
    "rules": {
        'no-param-reassign': 'off',
        'no-use-before-define': 'off',
        "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "always",
        "jsx": "always"
      },
    ],
     "no-console": "off",
     "prefer-destructuring": [
      "off",
    ]
    },
};
