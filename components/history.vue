<template>

  <div>
    <v-layout row wrap>
      <v-flex xs6 sm4 lg3 xl2 v-for="(row, i) in itemList" :key="i">
        <nuxt-link :to="'/item/'+row.id">
          <VideoCard
            :item="row"
            :count="i"
          ></VideoCard>
        </nuxt-link>
      </v-flex>

    </v-layout>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </div>

</template>

<script>

  import VideoCard from '~/components/video-card';
  import AdSense from '~/components/ad-sense';

  export default {

    components: {
      VideoCard,
      AdSense,
    },

    data() {
      return {
        param : {
          page: 1,
          limit: 16
        },
        itemList: [],
        pageCount : 0
      }
    },

    mounted() {
      this.getItemList();
    },

    methods: {
      getItemList() {
        this.$axios.$get("/api/user/views", {params:this.param})
          .then((result)=>{
            this.itemList = result.views;
            this.pageCount = Math.ceil(result.count / this.param.limit);
          })
      },

      pageClick() {
        this.getItemList();
      }
    }

  }
</script>
