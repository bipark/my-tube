<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <h2 class="mt-2 ml-1 mb-2">큐레이션 카테고리</h2>

    <div class="flex-container mt-2 mb-4">
      <div v-for="item in category" :key="item.category">
        <v-chip dark :color="$store.state.bcolor" @click="getCatList(item.category)">
          <v-avatar class="white">{{item.count}}</v-avatar>
          <div class="category-title-text">
            {{item.category}}
          </div>
        </v-chip>
      </div>
    </div>

    <CurationListShort
      :curationList="curationList"
      :showmore="true"
    />
    <AdSense/>
    
  </component>

</template>

<script>

	import CurationListShort from  '~/components/curation-list-short';
  import VideoCard from '~/components/video-card';
  import AdSense from '~/components/ad-sense';

  export default {

    components: {
	    CurationListShort,
      VideoCard,
      AdSense,
    },

    async asyncData({app, params, store, query}) {
      const res = await app.$axios.$get("/api/category");
      return {
        category: res.result,
        curationList: [],
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

<style scoped>

  .flex-container {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .flex-item {
    display: inline-flex;
  }
</style>
