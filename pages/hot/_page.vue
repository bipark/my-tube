<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">인기 큐레이션</h2>

    <CurationListShort
      :curationList="curationList"
      :showmore="true"
    />
    <AdSense/>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

	import CurationListShort from  '~/components/curation-list-short';
  import AdSense from '~/components/ad-sense';

  export default {
    components: {
	    CurationListShort,
      AdSense,
    },

    async asyncData({app, params, store, query}) {

      const param = {
	      page: params.page ? parseInt(params.page) : 1,
        limit: 10,
        detail_limit: 6,
        popular_order: true,
        is_show: false
      };

      const result = await app.$axios.$get("/api/curation/master", {params:param});
      return {
        curationList : result.curations,
        pageCount : Math.ceil(result.count / param.limit),
        param : param
      }

    },

    mounted() {
    },

    methods: {
      getServiceCurationList() {
        this.$axios.$get("/api/curation/master", {params:this.param})
          .then((result)=>{
            this.curationList = result.curations;
            window.scrollTo(0, 0);
          })
      },

      pageClick() {
	      this.$router.push('/hot/'+this.param.page);
        this.getServiceCurationList();
      }

    }

  }

</script>

<style>
</style>

