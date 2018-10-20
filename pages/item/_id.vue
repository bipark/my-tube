<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <div v-if="video">
      <script type="application/ld+json" v-html="ldjson"/>

      <no-ssr>
        <div class="video_player">
          <youtube
            :video-id="video.video_id"
            :player-vars="playerVars"
            player-width="100%"
            @ready="playerReady"
            @playing="playing"
            @ended="ended"
            ref="youtube"
            style="width: 100%"
          >
          </youtube>
        </div>
      </no-ssr>

      <v-layout row wrap class="mt-3 mb-1">
        <h2 class="ml-1 mr-1">{{video.title}}</h2>
      </v-layout>

      <v-layout row wrap style="font-size: 13px">
        <div  class="ml-1 mr-1">
          {{video.note}}
        </div>
      </v-layout>

      <v-layout row wrap class="mb-3 mt-1">
        <div class="mr-3 ml-1 dark-gray-text">
          업로드 일자 : {{publishedDate}}
        </div>
        <div class="mr-3 ml-1 dark-gray-text">
          시간 : {{duration}}
        </div>
        <div class="mr-3 dark-gray-text">
          조회 : {{video.views}}
        </div>
        <div v-if="video.like_count > 0" class="mr-3 dark-gray-text">
          좋아요 : {{video.like_count}}
        </div>
        <div v-if="video.bookmark_count > 0" class="mr-3 dark-gray-text">
          북마크 : {{video.bookmark_count}}
        </div>
      </v-layout>

      <ShareComp :meta="meta" from="item" class="ml-1 mr-1 mt-3"/>

      <v-layout row wrap class="mt-2 mb-3 ml-1 mr-1 ">
        <v-flex>
          <span v-if="like">
            <v-btn fab small :color="$store.state.bgcolor" @click.native="addLike(false)">
              <img src="@/assets/icons/heart.svg" width="18" height="18">
            </v-btn>
          </span>

          <span v-else>
            <v-btn fab small :color="$store.state.bgcolor" @click.native="addLike(true)">
              <img src="@/assets/icons/heart.svg" width="18" height="18" class="revert">
            </v-btn>
          </span>

          <span v-if="bookmark">
            <v-btn fab small :color="$store.state.bgcolor" @click.native="addBookmark(false)">
              <img src="@/assets/icons/bookmark.svg" width="18" height="18">
            </v-btn>
          </span>
          <span v-else>
            <v-btn fab small :color="$store.state.bgcolor" @click.native="addBookmark(true)">
              <img src="@/assets/icons/bookmark.svg" width="18" height="18" class="revert">
            </v-btn>
          </span>
          <span>
            <ReportComp :item_id="item_id"/>
          </span>
        </v-flex>

      </v-layout>

      <Comment :item_id="item_id"/>
      <AdSense/>

      <v-layout row class="mt-4">
        <div v-if="master">
          <nuxt-link :to="'/curation/'+master.id">
            <h2 class="ml-1 mr-1">{{master.title}}</h2>
            <div class="ml-1 mr-1">
              {{master.description}}
            </div>
          </nuxt-link>
        </div>
      </v-layout>

      <div v-if="clist.length > 0" class="mt-2">
        <ItemList
          :itemlist="clist"
          :curation="curation"
        ></ItemList>
      </div>

    </div>


  </component>

</template>

<script>

  import Vue from 'vue';

  import VideoCard from '~/components/video-card';
  import ItemList from '~/components/item-list';
  import ShareComp from '~/components/share-comp';
  import AdSense from '~/components/ad-sense';
  import ReportComp from '~/components/report-comp';
  import Comment from '~/components/comment';


  export default {
    components: {
      ItemList,
      VideoCard,
      ShareComp,
      AdSense,
      ReportComp,
      Comment,
    },

    async asyncData({app, params, store, query}) {

      const result1 = await app.$axios.get("/api/video/detail?id="+params.id);
      const video = result1.data.video.length > 0 ? result1.data.video[0] : null;

      const param = {
        "item_id": params.id,
        "curation_id": query.curation
      };

      let vnumber = -1;
      const result = await app.$axios.$get("/api/curation/details/byid", {params:param});
      result.details.forEach((item, index)=>{
        if (item.id == params.id) {
          vnumber = index;
        }
      });

      let metajson = null;
      if (video) {
        metajson = {
          "@context": "http://schema.org",
          "@type": "VideoObject",
          "name": video.title,
          "description": video.note.length > 0 ? video.note : video.title,
          "thumbnailUrl": video.thumb_medium,
          "uploadDate": video.publishedDate,
          "duration": video.duration,
          "publisher": {
            "@type": "Organization",
            "name": "CFVDO.com",
            "url": "https://cfvdo.com"
          },
          "contentUrl": "https://cfvdo.com/item/"+video.id,
          "embedUrl": "https://www.youtube.com/embed/"+video.video_id
        }
      }

      return {
	      player: null,
	      videonumber: vnumber,
        video : video,
        master : result.master,
        clist : result.details,
        bookmark : null,
        like : null,
        rate : null,
        item_id: params.id,
        curation: query.curation ? query.curation : null,
        meta: video,
        ldjson : metajson,
        comment: null,
      }
    },

    head() {

      // FOR SEO
      if (this.meta) {
        return {
          title : this.meta.title,
          meta: [
            { hid: 'title', name: 'title', content: this.meta.title },
            { hid: 'description', name: 'description', content: this.meta.note },
            { hid: 'keyword', name: 'keyword', content: this.meta.tags },
            { hid: 'og:title', property: 'og:title', content: this.meta.title },
            { hid: 'og:description', property: 'og:description', content: this.meta.note },
            { hid: 'og:type', property: 'og:type', content: 'video.movie' },
            { hid: 'og:url', property: 'og:url', content: 'http://cfvdo.com/item/'+this.meta.id },
            { hid: 'og:image', property: 'og:image', content: this.meta.thumb_high },
            { hid: 'og:image:width', property: 'og:image:width', content: 480 },
            { hid: 'og:image:height', property: 'og:image:height', content: 360 }
          ]
        }
      } else {
        return {};
      }

    },

	  beforeDestroy() {
		  if (this.player) {
			  this.player.stopVideo();
		  }
	  },

	  mounted() {
      this.getActions();
      this.addViewCount();
    },

    computed: {
	    publishedDate() {
		    return this.$moment(this.video.publishedDate).format('YYYY-MM-DD');
	    },

      autoplay() {
	      return (this.$store.state.user && this.$store.state.user.autoplay);
      },

      playerVars() {
	    	return {
			    autoplay: (this.$store.state.user && this.$store.state.user.autoplay)
		    }
      },

	    duration() {
		    if (this.video.duration) {
			    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
			    var hours = 0, minutes = 0, seconds = 0, totalseconds;

			    if (reptms.test(this.video.duration)) {
				    var matches = reptms.exec(this.video.duration);
				    if (matches[1]) hours = Number(matches[1]);
				    if (matches[2]) minutes = Number(matches[2]);
				    if (matches[3]) seconds = Number(matches[3]);
				    totalseconds = hours * 3600  + minutes * 60 + seconds;
				    if (hours > 0) {
					    return this.$moment.utc(totalseconds*1000).format('HH:mm:ss');
				    } else {
					    return this.$moment.utc(totalseconds*1000).format('mm:ss');
				    }
			    } else {
				    return null;
			    }
		    } else {
			    return null;
		    }
	    }

    },

	  methods: {
      getItem() {

        this.$axios.get("/api/video/detail?id="+this.item_id)
          .then((result1)=>{
            this.video = result1.data.video.length > 0 ? result1.data.video[0] : null;
            this.bookmark = result1.bookmark;
            this.like = result1.like;

            this.getActions();
          });

        const param = {
          "item_id": this.item_id,
          "curation_id": this.curation_id
        };

        this.$axios.$get("/api/curation/details/byid", {params:param})
          .then((result)=>{
            this.master = result.master;
            this.clist = result.details;
            this.clist.forEach((item, index)=>{
              if (item.id == this.item_id) {
                this.videonumber = index;
              }
            });
          });
      },

      getActions() {

        const param = {
          "item_id": this.item_id,
          "curation_id": this.curation_id
        };

        this.$axios.get("/api/video/actions", {params:param})
          .then((result)=>{
            this.bookmark = result.data.bookmark;
            this.like = result.data.like;
            this.rate = result.data.rate;
          });

      },

      addViewCount() {
        const postparams = {
          "item_id": this.item_id
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/video/view/add", {params:postparams})
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
          "item_id": this.item_id,
          "kind": kind
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/video/bookmark/add", {params:postparams})
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
          "like_id": this.like ? this.like.id : null,
          "item_id": this.item_id,
          "kind": kind
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/video/like/add", {params:postparams})
          .then((result)=>{
            this.getItem();
          });
      },

      increaseVideoCount() {
        if (this.autoplay) {
          this.videonumber = this.videonumber++ === (this.clist.length-1) ? 0 : this.videonumber++;
          this.video = this.clist[this.videonumber];
          this.item_id = this.video.id;

	        this.$root.$emit('ChangeItem', this.item_id);
        }
      },

		  playerReady(event) {
			  this.player = event.target
		  },

		  playing() {
      },

      ended() {
        this.increaseVideoCount();
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
          "item_id": this.item_id,
          "kind": "item"
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/video/rate/add", {params:postparams})
          .then((result)=>{
            this.getItem();
          });
      },

    },

  }
</script>

<style>
  .dark-gray-text {
    color: darkgrey;
    font-size: 13px;
  }
</style>
