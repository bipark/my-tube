<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <no-ssr>
      <v-layout row wrap>
        <div class="video_player">
          <youtube
            :video-id="video.video_id"
            ref="youtube"
            style="width: 100%"
          >
          </youtube>
        </div>
      </v-layout>
    </no-ssr>

    <v-layout row class="mt-3 mb-1">
      <h2>{{video.title}}</h2>
    </v-layout>

    <v-layout row>
      {{video.note}}
    </v-layout>

    <v-layout row wrap class="mt-2 mb-3">
      <div class="mr-3">
        {{video.cdate}}
      </div>
      <div class="mr-3">
        조회 : {{video.views}}
      </div>
      <div v-if="video.like_count > 0" class="mr-3">
        좋아요 : {{video.like_count}}
      </div>
      <div v-if="video.bookmark_count > 0" class="mr-3">
        북마크 : {{video.bookmark_count}}
      </div>
    </v-layout>

    <v-layout row wrap>
      <v-btn outline color="red" v-on:click="deleteItem()">비디오 삭제</v-btn>
    </v-layout>

  </component>

</template>

<script>

  export default {

    async asyncData({app, params, store, query}) {

      const param = {id:params.id};
      const result = await app.$axios.get("/api/video/detail", {params:param});
      const video = result.data.video.length > 0 ? result.data.video[0] : null;

      return {
        item_id: video.id,
        video: video,
        video_id: video.video_id,
      }
    },

    methods: {
      deleteItem() {

        var r = confirm("선택한 비디오를 삭제 하겠습니까?");
        if (r == true) {
          const postparams = {
            "id": this.item_id
          };

          // POST TO DB SERVER
          this.$axios.$post("/api/video/delete", {params:postparams})
            .then((result)=>{
              if (result.err) {
                if (result.err.sqlMessage) {
                  alert(result.err.sqlMessage);
                } else {
                  alert(result.err);
                }
              } else {
                window.history.back();
              }
            });
        }
      },


    },

  }
</script>

<style>
</style>
