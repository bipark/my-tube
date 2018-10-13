<template>

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

</template>

<script>

  export default {

    data() {
	    return {
	    	video: null,
		    videonumber: 0,
		    features: [],
	    }
    },

	  computed: {
		  autoplay() {
			  return (this.$store.state.user && this.$store.state.user.autoplay);
		  },

		  playerVars() {
			  return {
				  autoplay: (this.$store.state.user && this.$store.state.user.autoplay)
			  }
		  }
	  },


	  created() {
    	this.getFeatres();
    },

	  methods: {
    	getFeatres() {
		    this.$axios.get("/api/features")
			    .then((res)=>{
				    this.features = res.data.features;
				    this.videonumber = Math.floor(Math.random() * res.data.count);
				    this.video = this.features[this.videonumber];
			    });
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

	  }

  }

</script>