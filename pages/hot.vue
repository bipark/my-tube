<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">인기 큐레이션</h2>

    <v-layout row wrap>
      <div v-for="row in curationList" :key="row.id">

        <v-layout row>
          <v-flex sm10>
            <nuxt-link :to="'/curation/'+row.id">
              <div class="list_title ml-1">{{row.title}}</div>
            </nuxt-link>
          </v-flex>
          <v-flex sm2>
            <nuxt-link :to="'/curation/'+row.id">
              <div class="view_more mr-1" v-if="row.details.length > 5">
                더보기
              </div>
            </nuxt-link>
          </v-flex>
        </v-layout>
        <v-divider class="item-list-divider"/>

        <ItemList
          :itemlist="row.details"
          :curation="row.id"
        ></ItemList>
        <div style="height: 20px"></div>

      </div>

    </v-layout>

    <AdSense/>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

  import ItemList from '~/components/item-list';
  import AdSense from '~/components/ad-sense';

  export default {
    components: {
      ItemList,
      AdSense,
    },

    async asyncData({app, params, store, query}) {

      const param = {
        page: query.page ? parseInt(query.page) : 1,
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
      // this.getServiceCurationList();
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
        this.$router.push('?page='+this.param.page);
        this.getServiceCurationList();
      }

    }

  }

</script>

<style>
</style>

