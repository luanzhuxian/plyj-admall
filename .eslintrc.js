// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint'
  },

  env: {
    browser: true
  },

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  // add your custom rules here
  rules: {
    'no-debugger': 'off',
    'camelcase': 0,
    'indent': ['error', 4, { 'SwitchCase': 1 }],
    'prefer-const': 'error', // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--const
    'no-var': 'error', // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--one-const
    'object-shorthand': 'error', // http://docs.youpenglai.cn/spec/javascript_specification.html#es6-object-shorthand
    'vue/html-indent': ['error', 4], // vue-html 4个缩进
    'quote-props': ["error", "as-needed"], // 详见: http://docs.youpenglai.cn/spec/javascript_specification.html#objects--quoted-props
    'array-callback-return': "error", // 详见: http://docs.youpenglai.cn/spec/javascript_specification.html#arrays--callback-return
    // 这有bug
    "prefer-destructuring": ["error", {
      "array": false,
      "object": false
    }, {
      "enforceForRenamedProperties": false
    }], // http://docs.youpenglai.cn/spec/javascript_specification.html#destructuring--object
    "template-curly-spacing": ["error", "always"], // 校验模板字符串中的空格 // http://docs.youpenglai.cn/spec/javascript_specification.html#es6-template-literals
    'prefer-template': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#es6-template-literals
    'no-eval': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#strings--eval
    'no-useless-escape': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#strings--escaping
    'no-array-constructor': "error",
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'accessor-pairs': ['error', {
      'setWithoutGet': true,
      'getWithoutSet': true
    }], // http://docs.youpenglai.cn/spec/javascript_specification.html#accessors--consistent
    'newline-per-chained-call': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#whitespace--chains
    'array-bracket-spacing': ["error", "never"], // http://docs.youpenglai.cn/spec/javascript_specification.html#whitespace--in-brackets
    'line-comment-position': ["error", { "position": "above" }], // http://docs.youpenglai.cn/spec/javascript_specification.html#comments--singleline
    'lines-around-comment': ["error", { "beforeLineComment": false, "allowBlockStart": true }], // http://docs.youpenglai.cn/spec/javascript_specification.html#comments--singleline
    // 'multiline-comment-style': ["error", "starred-block"], // http://docs.youpenglai.cn/spec/javascript_specification.html#comments--multiline
    'no-inline-comments': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#comments--singleline
    // 'no-nested-ternary': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#comparison--nested-ternaries
    'dot-notation': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#properties--dot
    'one-var': ["error", "never"], // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--one-const
    'no-multi-assign': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--no-chain-assignment
    // 'no-plusplus': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--unary-increment-decrement
    'operator-linebreak': ["error", "after", {
      "overrides": {
        "?": "before",
        ":": "before",
        '=': 'none'
      }
    }], // http://docs.youpenglai.cn/spec/javascript_specification.html#variables--linebreak
    'func-style': ["error", "expression"], // http://docs.youpenglai.cn/spec/javascript_specification.html#functions--declarations
    'no-loop-func': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#functions--in-blocks
    'prefer-rest-params': 'error', // http://docs.youpenglai.cn/spec/javascript_specification.html#es6-rest
    // 'no-param-reassign': ["error", { "props": false }], // http://docs.youpenglai.cn/spec/javascript_specification.html#functions--mutate-params
    'prefer-spread': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#functions--spread-vs-apply
    'function-paren-newline': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#functions--signature-invocation-indentation
    'no-new-func': "error",
    'space-before-function-paren': "error",
    'prefer-arrow-callback': ["error", {
      "allowNamedFunctions": true,
      'allowUnboundThis': true
    }], // http://docs.youpenglai.cn/spec/javascript_specification.html#arrows--use-them
    'arrow-body-style': ["error", "as-needed"], // http://docs.youpenglai.cn/spec/javascript_specification.html#arrows--implicit-return
    'arrow-parens': ["error", "as-needed"], // http://docs.youpenglai.cn/spec/javascript_specification.html#arrows--one-arg-parens
    // 'no-confusing-arrow': "error", // http://docs.youpenglai.cn/spec/javascript_specification.html#arrows--confusing
    'implicit-arrow-linebreak': ["error", "beside"], // http://docs.youpenglai.cn/spec/javascript_specification.html#whitespace--implicit-arrow-linebreak
    'no-useless-constructor': 'error',
    'no-dupe-class-members': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'generator-star-spacing': ["error", {"before": false, "after": true}],
    'max-len': ['error', { code: 400, ignoreComments: true, ignoreRegExpLiterals: true,  ignoreStrings: true }], // https://eslint.org/docs/rules/operator-linebreak.html
    'no-mixed-operators': 'error',
    'no-unneeded-ternary': 'error',
    'nonblock-statement-body-position': ['error', 'any'],
    'brace-style': "error",
    'no-else-return': 'error',
    'no-underscore-dangle': 'error'
  },

  // 优先使用vue强烈推荐的配置和标准配置，其余配置在rules中修改
  'extends': [
    'plugin:vue/strongly-recommended',
    'standard'
  ]
}
