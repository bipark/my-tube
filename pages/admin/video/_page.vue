<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">비디오 관리</h2>

    <v-card class="pl-4 pr-4 pt-2 mb-4 mt-2">
      <YoutubeInput
        :from="'additem'"
        class="mt-3 mb-3 ml-1 mr-1"
      ></YoutubeInput>
    </v-card>

    <ItemList
      :itemlist="itemlist"
      class="mb-4"
    ></ItemList>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

  import ItemList from '~/components/admin/item-list';
  import YoutubeInput from '~/components/youtube-input';


  export default {

    components: {
      ItemList,
      YoutubeInput
    },

    async asyncData({app, params, store, query}) {

      let param = {
	      page: params.page ? parseInt(params.page) : 1,
        limit: 30,
      };

      const result = await app.$axios.$get("/api/video/list", {params:param});
      return {
        param : param,
        itemlist: result.videolist,
        pageCount : Math.ceil(result.count / param.limit),
      }
    },

    computed: {
      user () {
        return this.$store.state.user ? this.$store.state.user.uid : null
      }
    },

    mounted() {
      this.$root.$on('SaveVideoAddItem', (result) =>{
        this.getItemsList();
      });
    },

    methods: {

      getItemsList() {
        this.$axios.get("/api/video/list", {params:this.param})
          .then((result)=>{
            this.itemlist = result.data.videolist;
            window.scrollTo(0, 0);
          })

      },

      pageClick() {
	      this.$router.push('/admin/video/'+this.param.page);
        this.getItemsList();
      }

    },

  }

</script>

<style>
</style>
