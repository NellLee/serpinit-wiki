/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'no-restricted-syntax': [
			'error',
			{
				selector:
					"CallExpression[callee.property.name=/^(substring|slice)$/][callee.object.property.name='pathname']",
				message:
					"Manual pathname string surgery (e.g. new URL('.', import.meta.url).pathname.substring(1)) is a Windows-only trick that breaks under WSL, where the path is already POSIX-absolute. Use path.dirname(fileURLToPath(import.meta.url)) from 'node:url' instead."
			}
		]
	},
	overrides: [
		{
			files: ['*.ts'],
			rules: {
				'no-undef': 'off'
			}
		},
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				'no-undef': 'off'
			}
		}
	]
};
