require('dotenv').config();

module.exports = {

	server: {
		port: 3999,
		host: '0.0.0.0', 
	},

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
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
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
	    { src: 'https://polyfill.io/v3/polyfill.min.js?flags=gated%7Calways&rum=true&features=default%2CArray.prototype.some%2CArray.prototype.filter%2CRegExp.prototype.flags%2CSymbol.hasInstance%2CFunction.prototype.bind%2CFunction.prototype.name%2CArray.prototype.%40%40iterator%2CArray.prototype.copyWithin%2CArray.prototype.entries%2CArray.prototype.every%2CArray.prototype.fill%2CArray.prototype.find%2CArray.prototype.findIndex%2CArray.prototype.forEach%2CArray.prototype.includes%2CArray.prototype.indexOf%2CArray.prototype.keys%2CArray.prototype.lastIndexOf%2CArray.prototype.map%2CArray.prototype.reduce%2CArray.prototype.reduceRight%2CArray.prototype.values%2CArray.from%2CArray.isArray%2CArray.of%2CAudioContext%2CBlob%2CCustomEvent%2CDOMTokenList%2CDOMTokenList.prototype.%40%40iterator%2CDate.now%2CDate.prototype.toISOString%2CDocumentFragment%2CDocumentFragment.prototype.append%2CDocumentFragment.prototype.prepend%2CElement%2CElement.prototype.after%2CElement.prototype.append%2CElement.prototype.before%2CElement.prototype.classList%2CElement.prototype.cloneNode%2CElement.prototype.closest%2CElement.prototype.dataset%2CElement.prototype.matches%2CElement.prototype.placeholder%2CElement.prototype.prepend%2CElement.prototype.remove%2CElement.prototype.replaceWith%2CEvent%2CEvent.focusin%2CEvent.hashchange%2CEventSource%2CHTMLCanvasElement.prototype.toBlob%2CHTMLDocument%2CHTMLPictureElement%2CIntersectionObserver%2CIntersectionObserverEntry%2CIntl%2CJSON%2CMap%2CMutationObserver%2CNode.prototype.contains%2CNodeList.prototype.%40%40iterator%2CNodeList.prototype.forEach%2CNumber.Epsilon%2CNumber.MAX_SAFE_INTEGER%2CNumber.MIN_SAFE_INTEGER%2CNumber.isFinite%2CNumber.isInteger%2CNumber.isNaN%2CNumber.isSafeInteger%2CNumber.parseFloat%2CNumber.parseInt%2CObject.assign%2CObject.create%2CObject.defineProperties%2CObject.defineProperty%2CObject.entries%2CObject.freeze%2CObject.getOwnPropertyDescriptor%2CObject.getOwnPropertyNames%2CObject.getPrototypeOf%2CObject.is%2CObject.keys%2CObject.setPrototypeOf%2CObject.values%2CPromise%2CPromise.prototype.finally%2CSet%2CString.fromCodePoint%2CString.prototype.%40%40iterator%2CString.prototype.codePointAt%2CString.prototype.endsWith%2CString.prototype.includes%2CString.prototype.padEnd%2CString.prototype.padStart%2CString.prototype.repeat%2CString.prototype.startsWith%2CString.prototype.trim%2CSymbol%2CSymbol.isConcatSpreadable%2CSymbol.iterator%2CSymbol.match%2CSymbol.replace%2CSymbol.search%2CSymbol.species%2CSymbol.split%2CSymbol.toPrimitive%2CSymbol.toStringTag%2CSymbol.unscopables%2CURL%2CUserTiming%2CWeakMap%2CWeakSet%2CWebAnimations%2CWindow%2CXMLHttpRequest%2Catob%2Cconsole%2Cconsole.log%2CdevicePixelRatio%2Cdocument%2Cdocument.currentScript%2Cdocument.getElementsByClassName%2Cdocument.head%2Cdocument.querySelector%2Cdocument.visibilityState%2Cfetch%2CgetComputedStyle%2ClocalStorage%2Clocation.origin%2CmatchMedia%2Cnavigator.geolocation%2Cnavigator.sendBeacon%2Cperformance.now%2CrequestAnimationFrame%2Cscreen.orientation%2CsetImmediate%2C%7Ehtml5-elements%2C%7Eviewport', crossorigin:'anonymous' },
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
	  {src: '~/plugins/vue-youtube-embed.js', ssr:false},
	  {src: '~/plugins/vue-localstorage.js'},
	  {src: '~/plugins/axios.js'},
	  {src: '~/plugins/mobile-access.js', ssr:false},
	  {src: '~/plugins/vue-social-sharing.js', ssr:false}
  ],

  modules: [
	  '@nuxtjs/pwa',
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

	manifest: {
		name: '광고동영상',
		short_name: 'cfvdo',
		lang: 'kr'
	},

	workbox: {
		runtimeCaching: [
			{
				urlPattern: 'https://cfvdo.com/.*',
				strategyOptions: {
					cacheName: 'our-cache',
					cacheExpiration: {
						maxEntries: 10,
						maxAgeSeconds: 300
					}
				}
			}
		]
	}

}
