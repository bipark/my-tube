<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <v-layout row wrap class="mb-2">
      <v-flex xs6>
        <h2 class="mt-2 ml-1 mb-2">큐레이터 픽</h2>
      </v-flex>
      <v-flex xs6 style="text-align: right">
        <v-btn outline :color="$store.state.bcolor" v-on:click="dialog = true">큐레이터 픽 추가</v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="mb-4"/>

    <v-layout row wrap>
      <v-flex xs6 sm4 lg2 xl2 v-for="(item, i) in features" :key="item.id">
        <div>
          <span v-if="item.active != '0'">
            <v-icon @click="hideItem(item.fid, 0)">check_box</v-icon>
          </span>
          <span v-else>
            <v-icon @click="hideItem(item.fid, 1)">check_box_outline_blank</v-icon>
            </span>
          <span>
              <v-icon @click="deleteItem(item.fid)">delete</v-icon>
            </span>
        </div>
        <VideoCard
          :item="item"
          :count="i"
          hideDetails="true"
        ></VideoCard>
      </v-flex>
    </v-layout>

    <div class="text-xs-center mt-5" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

    <!--// ADD VIDEO DIALOG-->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="700">
        <v-card class="pl-4 pr-4 pt-4 pb-4">
          <h2>큐레이터 픽 추가</h2>
          <v-layout>
            <v-flex xs10>
              <v-text-field
                label="비디오 번호를 입력하세요"
                prepend-inner-icon="video_library"
                v-model="video_id"
              ></v-text-field>
            </v-flex>

            <v-flex xs2>
              <div style="padding-left: 5px; padding-right: 5px">
                <v-btn :color="$store.state.bcolor" block outline large @click.native="postPickItem">추가</v-btn>
              </div>
            </v-flex>
          </v-layout>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outline @click.native="dialog = false">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </component>

</template>

<script>

	import VideoCard from '~/components/video-card'

  export default {

	  components: {
		  VideoCard
	  },

	  async asyncData({app, params, store, query}) {

      let param = {
	      page: params.page ? parseInt(params.page) : 1,
        limit: 30,
        all: true
      };

      const result = await app.$axios.get("/api/features", {params:param});
      return {
        features: result.data.features,
        param: param,
        pageCount : Math.ceil(result.data.count / param.limit),
        dialog: false,
        video_id: null,
      }
    },

    mounted() {
      this.$root.$on("ReloadPickList", (result) =>{
        this.dialog = false;
        this.getItemsList();
      });
    },


    methods: {
      getItemsList() {
        this.$axios.get("/api/features", {params:this.param})
          .then((result)=>{
            this.features = result.data.features;
            window.scrollTo(0, 0);
          });
      },

      pageClick() {
	      this.$router.push('/admin/pick/'+this.param.page);
        this.getItemsList();
      },

      hideItem: function(id, value) {
        var r = confirm("선택한 비디오의 Visible 상태를 바꿉니다.");
        if (r == true) {
          const postparams = {
            "id": id,
            "active": value
          };

          this.$axios.$post("/api/features/hide", {params:postparams})
            .then((result)=>{
              this.getItemsList();
            });
        }
      },

      deleteItem: function(id) {
        var r = confirm("선택한 Pick을 삭제 하겠습니까?");
        if (r == true) {
          const postparams = {
            "id": id
          };

          this.$axios.$post("/api/features/delete", {params:postparams})
            .then((result)=>{
              this.getItemsList();
            });
        }
      },

      postPickItem() {
        const postparams = {
          "item_id": this.video_id
        };

        this.$axios.$post("/api/features/add", {params:postparams})
          .then((result)=>{
            this.video_id = null;
            this.dialog = false;

            if (result.err) {
              alert(result.err)
            } else {
              this.getItemsList();
            }
          });

      },

    }
  }

</script>

<style scoped>
</style>
