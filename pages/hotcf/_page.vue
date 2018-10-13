<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <h2 class="mt-2 ml-1 mb-2">인기 동영상</h2>

    <v-layout row wrap>
      <v-flex xs6 sm4 lg3 xl2 v-for="(row, i) in itemList" :key="row.id">
        <nuxt-link :to="'/item/'+row.id">
          <VideoCard
            :item="row"
            :count="i"
          ></VideoCard>
        </nuxt-link>
      </v-flex>

    </v-layout>

    <AdSense/>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

  import VideoCard from '~/components/video-card';
  import AdSense from '~/components/ad-sense';


  export default {

    components: {
      VideoCard,
      AdSense,
    },

    async asyncData({app, params, store, query}) {

      let param = {
	      page: params.page ? parseInt(params.page) : 1,
        limit: 36,
        isshow: 1,
        popular_order: true
      };

      const result = await app.$axios.$get("/api/video/list", {params:param});
      return {
        param : param,
        itemList: result.videolist,
        pageCount : Math.ceil(result.count / param.limit),
      }

    },

    methods: {
      getItemList() {
        this.$axios.$get("/api/video/list", {params:this.param})
          .then((result)=>{
            this.itemList = result.videolist;
            window.scrollTo(0, 0);
          })
      },

      pageClick() {
	      this.$router.push('/hotcf/'+this.param.page);
        this.getItemList();
      }

    }

  }

</script>
