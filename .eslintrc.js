module.exports = {
    root: true,
    env: {
        jest: true,
        browser: true,
        node: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'airbnb', 'airbnb-typescript', 'prettier'],
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
            },
        },
    },
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
        sourceType: 'module',
        project: './tsconfig.eslint.json',
    },
    plugins: ['react', 'jsx-a11y', 'import', '@typescript-eslint'],
    rules: {
        'global-require': 0,
        'no-bitwise': 'off',
        'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
        'no-shadow': 'off',
        'no-plusplus': 0,
        indent: [
            'warn',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'linebreak-style': 'off',
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'arrow-parens': 0,
        'arrow-body-style': 0,
        'object-curly-newline': 0,
        'implicit-arrow-linebreak': 0,
        'operator-linebreak': 0,
        'no-underscore-dangle': 0,
        'max-len': [2, { code: 250 }],
        'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
        'no-param-reassign': [2, { props: true, ignorePropertyModificationsForRegex: ['^state'] }],
        'no-use-before-define': 0,
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'default-param-last': 'off',
    },
    ignorePatterns: ['node_modules', '.next', 'public'],
}
