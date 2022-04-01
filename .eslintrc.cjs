/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/eslint-config-typescript/recommended',
		'@vue/eslint-config-prettier',
	],
	env: {
		'vue/setup-compiler-macros': true,
	},
	plugins: [],
	overrides: [],
	rules: {
		'array-bracket-spacing': ['warn', 'never'],
		'object-curly-spacing': ['warn', 'always'],
		"@typescript-eslint/ban-types": ['off'],
		'@typescript-eslint/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/func-call-spacing': ['error'],
		'@typescript-eslint/member-ordering': ['warn'],
		'@typescript-eslint/no-require-imports': ['error'],
		'@typescript-eslint/no-empty-interface': ['off'],
		'@typescript-eslint/no-explicit-any': ['off'],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				'argsIgnorePattern': '^_',
				'ignoreRestSiblings': true,
			},
		],
		'@typescript-eslint/no-non-null-assertion': ['off'],
		'@typescript-eslint/semi': ['error', 'never'],
		'@typescript-eslint/no-use-before-define': ['off'],
		'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
		'semi': 'off',
	},
}
