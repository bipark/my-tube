<template>

  <div v-if="item" style="padding-left: 2px; padding-right: 2px">
    <nuxt-link :to="link">
      <div class="img-container">
        <img ref="mainimg"
             class="img-st"
             :src="imglink"
             :alt="item.title"
             @onerror="changeImage"
        />
        <div class="bottom-right">{{duration}}</div>
      </div>
    </nuxt-link>
    <div class="img-title">
      <div>{{item.title}}</div>
    </div>
    <div v-if="!hideDetails">
      <div class="detail-text-small">
        {{publishedDate}}
        <!--<span v-if="item.views > 0" class="detail-text-small">-->
          <!--&nbsp;&nbsp; 조회수 : {{item.views}} 회-->
        <!--</span>-->
      </div>
    </div>
    <div class="mb-4"></div>
  </div>

</template>

<script>
  export default {

    props: {
      "item": {
        type: Object,
        default: null
      },
      "curation": {
        type: [Number, String],
        default: null
      },
      "count": {
        type: Number,
        default: 0
      },
      "hideDetails": {
      	type: [Boolean, String],
        default: false
      }
    },

    data () {
      return {
      	imglink: this.item.thumb_medium,
        link: this.curation ? "/item/"+this.item.id+"?curation="+this.curation : "/item/"+this.item.id
      }
    },


    computed: {

    	publishedDate() {
    		return this.$moment(this.item.publishedDate).format('YYYY-MM-DD');
      },

    	duration() {
    	  if (this.item.duration) {
		      var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		      var hours = 0, minutes = 0, seconds = 0, totalseconds;

		      if (reptms.test(this.item.duration)) {
			      var matches = reptms.exec(this.item.duration);
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

    mounted() {
    	//console.log(this.$refs.mainimg)
    },

    methods: {
    	changeImage() {
    	  this.imglink = this.item.thumb_standard;
      }
    }
  }
</script>

<style>
</style>
