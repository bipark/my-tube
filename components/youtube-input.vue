<template>

  <v-layout row wrap>
    <v-flex>
      <v-text-field
        label="유튜브에서 링크를 복사해서 입력하세요"
        prepend-inner-icon="video_library"
        v-model="tubelink"
      ></v-text-field>
    </v-flex>
    <v-flex>
      <div class="ml-2 mr-2">
        <v-btn :color="$store.state.bcolor" block outline large @click.native="saveYoutubeAndRelay">ADD</v-btn>
      </div>
    </v-flex>
  </v-layout>


</template>

<script>
  export default {

    props: {
      "from": String,
      "curation_no": Number
    },

    data () {
      return {
        tubelink: null
      }
    },


    mounted() {
    },

    methods: {

      getYoutubeData() {
        const videoid = this.getParameterByName("v", this.tubelink);
        if (videoid) {

          const params = {
            link: videoid,
            curation_no: this.curation_no
          };

          this.$axios.$post("/api/youtube/add", {param:params})
            .then((result)=>{
              if (result.err){
                alert(result.err);
                this.postEmit(null);
              } else {
                this.postEmit(null);
              }
              this.tubelink = null;
            })
            .catch((error)=>{
              console.log(error);
              alert(error);
              this.postEmit(null);
            });

        } else {
          alert("링크에 이상이 있습니다 확인해 주세요.")
        }

      },

      getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      },


      saveYoutubeAndRelay() {
        this.getYoutubeData();
      },

      postEmit(result) {
        if (this.from == "curation"){
          this.$root.$emit('ReloadCurationList', result);
        } else if (this.from == "additem") {
          this.$root.$emit('SaveVideoAddItem', result);
        } else if (this.from == "pick") {
          this.$root.$emit('ReloadPickList', result);
        }
      }

    }
  }
</script>

<style>
</style>
