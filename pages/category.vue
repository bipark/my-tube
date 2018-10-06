<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <h2 class="mt-2 ml-1 mb-2">큐레이션 카테고리</h2>

    <v-layout row wrap class="mt-2 mb-4">
      <v-flex v-for="item in category" :key="item.category">
        <div class="mr-1 ml-1">
          <v-chip dark :color="$store.state.bcolor" @click="getCatList(item.category)">
            <v-avatar class="white">{{item.count}}</v-avatar>
            <div class="category-title-text">
              {{item.category}}
            </div>
          </v-chip>
        </div>
      </v-flex>
    </v-layout>

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
          class="mb-3"
        ></ItemList>

      </div>

    </v-layout>

    <AdSense/>

  </component>

</template>

<script>
  import VideoCard from '~/components/video-card';
  import ItemList from '~/components/item-list';
  import AdSense from '~/components/ad-sense';

  export default {

    components: {
      ItemList,
      VideoCard,
      AdSense,
    },

    async asyncData({app, params, store, query}) {
      const res = await app.$axios.$get("/api/category");
      return {
        category: res.result,
        curationList: null,
      }
    },

    mounted() {
    	const catnumber = Math.floor(Math.random() * this.category.length);
      this.getCatList(this.category[catnumber].category);
    },

    methods: {

      getCategory() {
        this.$axios.$get("/api/category")
          .then((result) => {
            this.category = result.result;
          })
      },

      getCatList(category) {

        const param = {
          page: 1,
          limit: 100,
          detail_limit: 6,
          category: category,
          isshow: true
        };

        this.$axios.$get("/api/curation/master", {params:param})
          .then((result)=>{
            this.curationList = result.curations;
          })

      }
    }
  }
</script>

<style>
</style>
