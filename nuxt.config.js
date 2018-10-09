require('dotenv').config();

module.exports = {

  env: {
    mainTitle:process.env.MAIN_TITLE || 'TITLE',
    subTitle:process.env.SUB_TITLE || 'SUB_TITLE',
    companyName:process.env.COMPANY_NAME || 'COMPANY_NAME',
	  footer_facebook:process.env.FOOTER_FACEBOOK,
	  footer_googleplus:process.env.FOOTER_GOOGLEPLUS,
	  footer_pinterest:process.env.FOOTER_PINTEREST,
	  footer_twitter:process.env.FOOTER_TWITTER,
	  footer_email:process.env.FOOTER_EMAIL,
    show_ad:process.env.SHOW_AD,
	  bcolor:process.env.B_COLOR,
	  bgcolor:process.env.BG_COLOR,
  },

  head: {
    title: process.env.META_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: process.env.META_TITLE },
      { hid: 'subject', name: 'subject', content: process.env.META_SUBJECT },
      { hid: 'description', name: 'description', content: process.env.META_DESCRIPTION },
      { hid: 'keyword', name: 'keyword', content: process.env.META_KEYWORD },
      { hid: 'author', name: 'author', content: process.env.META_AUTHOR },
      { hid: 'og:title', property: 'og:title', content: process.env.META_TITLE },
	    { hid: 'og:description', property: 'og:description', content: process.env.META_OG_DESCRIPTION },
	    { hid: 'og:type', property: 'og:type', content: process.env.META_OG_TYPE },
      { hid: 'og:url', property: 'og:url', content: process.env.META_OG_URL },
      { hid: 'og:image', property: 'og:image', content: process.env.META_OG_IMAGE },
      { hid: 'og:site_name', property: 'og:site_name', content: process.env.META_TITLE },
      { hid: 'fb:app_id', property: 'fb:app_id', content: process.env.META_OG_FB_APP_ID },
    ],
    script: [
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon/favicon.ico' }
    ]
  },

  mode: 'universal',
  cache: true,
  router: {
    middleware: 'router-auth',
    mode: 'history',
  },
  css: [
	  '~assets/css/style.css'
  ],

  plugins: [
	  {src: '~/plugins/vue-youtube.js', ssr:false},
	  {src: '~/plugins/vue-localstorage.js'},
	  {src: '~/plugins/axios.js'},
	  {src: '~/plugins/mobile-access.js', ssr:false}
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
	  '@nuxtjs/moment',
	  'cookie-universal-nuxt',
	  'nuxt-client-init-module',
	  ['@nuxtjs/google-analytics', {
      id: process.env.GOOGLE_ANALYTICS_KEY
    }],
    // ['@nuxtjs/google-adsense', {
    //   id: process.env.GOOGLE_ADSENSE_KEY,
    //   pageLevelAds: false
    // }],
  ],

  loading: { color: process.env.B_COLOR },

  axios: {
    baseURL:process.env.API_SERVER,
  },

	serverMiddleware: [
		'~/apiserver/index.js'
	],

}
