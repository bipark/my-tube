<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <div v-if="video">
      <div class="mt-0 mb-5">
        <v-layout row wrap>
          <div class="video_player">
            <youtube
              :video-id="video.video_id"
              :player-vars="playerVars"
              ref="youtube"
              @playing="playing"
              @ended="ended"
              style="width: 100%"
            >
            </youtube>
          </div>
          <v-layout row class="mt-1">
            <nuxt-link :to="'/item/'+video.id">
              <h2 class="ml-1 mr-1">{{video.title}}</h2>
            </nuxt-link>
          </v-layout>
        </v-layout>
      </div>
    </div>

    <v-layout row wrap>
      <div v-for="row in curationList" :key="row.id">

        <v-layout row>
          <v-flex>
            <nuxt-link :to="'/curation/'+row.id">
              <div class="list_title ml-1">{{row.title}}</div>
            </nuxt-link>
          </v-flex>
          <v-flex>
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

    	if (query.platform == 'mobile') {
		    store.commit("setPlatform", true);
      }

      const res = await app.$axios.$get("/api/features");
      const videonumber = Math.floor(Math.random() * 5);

      const param = {
        page: query.page ? parseInt(query.page) : 1,
        limit: 10,
        detail_limit: 6,
        isshow: 1
      };

      const result = await app.$axios.$get("/api/curation/master", {params:param});
      return {
        curationList: result.curations,
        pageCount : Math.ceil(result.count / param.limit),
        param: param,
        playerVars: {
          autoplay: store.state.autoplay
        },
        videonumber: videonumber,
        features:res.features,
        video:res.features[videonumber],
        autoplay: true,
        loading: false,
      }
    },

    created() {
    },

    mounted() {
	    this.$localStorage.set("platform", this.$store.state.platform);
    },

    methods: {
      getServiceCurationList() {
        this.$axios.$get("/api/curation/master", {params:this.param})
          .then((result)=>{
            this.curationList = result.curations;
            window.scrollTo(0, 0);
          })
      },

      playing() {
      },

      ended() {
        this.increaseVideoCount();
      },

      increaseVideoCount() {
        if (this.autoplay) {
          this.videonumber = this.videonumber++ === (this.features.length-1) ? 0 : this.videonumber++;
          this.video = this.features[this.videonumber];
        }
      },

      pageClick() {
        this.$router.push('?page='+this.param.page);
        this.getServiceCurationList();
      },
    }

  }
</script>

<style>
</style>
