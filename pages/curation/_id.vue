<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <v-layout row>
      <h1 class="ml-1 mr-1 mt-2">{{master.title}}</h1>
    </v-layout>
    <v-layout row wrap class="ml-1 mr-1">
      {{master.description}}
    </v-layout>

    <v-layout class="mr-1 ml-1">
      <span class="mr-2" style="color : darkgray">
        {{master.cdate}}
      </span>
      <span class="mr-2" style="color : darkgray">
        조회수 : {{master.view_count}}
      </span>
      <span v-if="master.like_count > 0" class="mr-2" style="color : darkgray">
        좋아요 : {{master.like_count}}
      </span>
      <span v-if="master.bookmark_count > 0" class="mr-2" style="color : darkgray">
        북마크 :  {{master.bookmark_count}}
      </span>
    </v-layout>

    <v-layout row wrap>

      <div v-if="like">
        <v-btn fab small :color="$store.state.bgcolor" @click.native="addLike(false)">
          <img src="@/assets/icons/heart.svg" width="18" height="18">
        </v-btn>
      </div>

      <div v-else>
        <v-btn fab small :color="$store.state.bgcolor" @click.native="addLike(true)">
          <img src="@/assets/icons/heart.svg" width="18" height="18" class="revert">
        </v-btn>
      </div>

      <div v-if="bookmark">
        <v-btn fab small :color="$store.state.bgcolor" @click.native="addBookmark(false)">
          <img src="@/assets/icons/bookmark.svg" width="18" height="18">
        </v-btn>
      </div>
      <div v-else>
        <v-btn fab small :color="$store.state.bgcolor" @click.native="addBookmark(true)">
          <img src="@/assets/icons/bookmark.svg" width="18" height="18" class="revert">
        </v-btn>
      </div>
      <div style="height: 20px"></div>


    </v-layout>

    <AdSense/>

    <ItemList
      :itemlist="itemlist"
      :curation="curation_id"
      class="mt-4"
    ></ItemList>

  </component>

</template>

<script>

  import VideoCard from '~/components/video-card';
  import ItemList from '~/components/item-list';
  import ShareComp from '~/components/share-comp';
  import AdSense from '~/components/ad-sense';


  export default {
    components: {
      ItemList,
      VideoCard,
      ShareComp,
      AdSense,
    },

    async asyncData({app, params, store, query}) {

      const param = {
        isshow: 1,
        curationid:params.id
      };
      const result = await app.$axios.get("/api/curation/byid", {params:param});

      const master1 = result.data.master.length > 0 ? result.data.master[0] : null;
      const detail1 = result.data.curations.length > 0 ? result.data.curations[0] : null;

      return {
        curation_id: params.id,
        master: master1,
        itemlist: result.data.curations,
        like: result.data.like,
        bookmark: result.data.bookmark,
        meta: {
          master: master1,
          detail: detail1
        },
      }
    },

    head() {

      // FOR SEO
      if (this.meta.master && this.meta.detail) {
        return {
          title : this.meta.master.title,
          meta: [
            { hid: 'title', name: 'title', content: this.meta.master.title },
            { hid: 'description', name: 'description', content: this.meta.master.description },
            { hid: 'keyword', name: 'keyword', content: this.meta.master.title },
            { hid: 'og:title', property: 'og:title', content: this.meta.master.title },
            { hid: 'og:description', property: 'og:description', content: this.meta.master.description },
            { hid: 'og:type', property: 'og:type', content: 'video.movie' },
            { hid: 'og:url', property: 'og:url', content: 'https://cfvdo.com/curation/'+this.meta.master.id },
            { hid: 'og:image', property: 'og:image', content: this.meta.detail.thumb_high },
            { hid: 'og:image:width', property: 'og:image:width', content: 480 },
            { hid: 'og:image:height', property: 'og:image:height', content: 360 }
          ]
        }
      } else {
        return {};
      }

    },

    mounted() {
      this.addViewCount();

    },

    methods: {

      getItem() {
        const param = {
          isshow: 1,
          curationid:this.curation_id
        };

        this.$axios.$get("/api/curation/byid", {params:param})
          .then((result)=>{

            this.master = result.master.length > 0 ? result.master[0] : null;
            this.like = result.like;
            this.bookmark = result.bookmark;
          });
      },

      addViewCount() {
        const postparams = {
          "creator_id": this.$store.state.user ? this.$store.state.user.uid : null,
          "curation_id": this.curation_id
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/view/add", {params:postparams})
          .then((result)=>{
          });
      },

      addBookmark(kind) {

        if (!this.$store.state.user) {
	        this.$router.push({ name: "login", params: { redirect: this.$route.path }});
          return;
        }

        const postparams = {
          "bookmark_id": this.bookmark ? this.bookmark.id : null,
          "curation_id": this.curation_id,
          "kind": kind
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/bookmark/add", {params:postparams})
          .then((result)=>{
            this.getItem();
          });
      },


      addLike(kind) {

        if (!this.$store.state.user) {
	        this.$router.push({ name: "login", params: { redirect: this.$route.path }});
          return;
        }

        const postparams = {
          "bookmark_id": this.like ? this.like.id : null,
          "curation_id": this.curation_id,
          "kind": kind
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/like/add", {params:postparams})
          .then((result)=>{
            this.getItem();
          });
      },

      onBeforeRate(rate) {
        if (!this.$store.state.user) {
	        this.$router.push({ name: "login", params: { redirect: this.$route.path }});
          return;
        }
      },

      onAftereRate(rate) {
        if (!this.$store.state.user) {
	        this.$router.push({ name: "login", params: { redirect: this.$route.path }});
          return;
        }

        const postparams = {
          "rate": rate,
          "curation_id": this.curation_id,
          "kind": "item"
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/rate/add", {params:postparams})
          .then((result)=>{
            this.getItem();
          });
      },

    }

  }
</script>

<style>
</style>
