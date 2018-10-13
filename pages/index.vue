<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <HomePlayer/>
    <HomeCurationList
      :ppage="page"
    />
    <AdSense/>
  </component>

</template>

<script>

  import AdSense from '~/components/ad-sense';
  import HomePlayer from '~/components/home-video-player';
  import HomeCurationList from '~/components/home-curation-list';


  export default {
    components: {
      AdSense,
      HomePlayer,
      HomeCurationList,
    },

    async asyncData({app, params, store, query}) {

    	if (query.app) {
		    store.commit("setApp", query.app);
      }

      return {
        page: params.page ? parseInt(params.page) : 1
      }
    },

  }
</script>

<style>
</style>
