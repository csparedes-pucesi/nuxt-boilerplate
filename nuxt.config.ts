// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	runtimeConfig:{
		backendUrl: process.env.BACKEND_URL || 'http://localhost:3000'
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/ui',
	],
	css: ['~/assets/css/main.css', '~/assets/fonts/fonts.css'],
	ui: {
		theme: {
			colors: [
				'primary',
				'secondary',
				'tertiary',
				'info',
				'success',
				'warning',
				'error',
			],
		},
	},
});