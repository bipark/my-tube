<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">검색</h2>

    <form @submit.prevent="startSearch" class="mt-2 mb-2 ml-1 mr-1">
      <v-text-field
        label="Search"
        prepend-inner-icon="search"
        clearable
        solo
        v-model="searchWord"
      ></v-text-field>
    </form>

    <CurationListShort
      :curationList="curationList"
      :showmore="false"
    />

    <div v-if="itemList">
      <div v-if="itemList.length > 0">
        <h2>비디오</h2>
        <v-divider class="mb-3"></v-divider>

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

      </div>
    </div>

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

      const searchText = encodeURI(query.query);

      let result = null;
      if (searchText == 'undefined') {
        // 검색요청이 없으면 큐레이션 요청
        const param = {
          page: 1,
          limit: 1,
          detail_limit: 100,
          israndom: 1,
          isshow: false
        };

        result = await app.$axios.$get("/api/curation/master", {params:param});
        return {
          searchWord: null,
          searchText: result.searchText,
          curationList: result.curations,
          itemList: null
        }

      } else {
        result = await app.$axios.$get("/api/search?query="+searchText);
        return {
          searchWord: query.query,
          searchText: result.searchText,
          curationList: result.curations,
          itemList: result.details
        }

      }

    },

    methods : {
      startSearch() {
        this.$axios.$get("/api/search?query="+this.searchWord)
          .then((result)=>{
            this.$router.push("/search?query="+this.searchWord);
            this.curationList = result.curations;
            this.itemList = result.details;
          });

      },

      saveSearchText() {
        // 검색어 목록 저장
        if (this.searchText == null) {
          return;
        }

        const postparams = {
          "keyword": this.searchText
        };

        this.$axios.$post("/api/search/add/history", {param:postparams})
          .then((result)=>{
          });

      }
    }

  }
</script>

<style>
</style>
