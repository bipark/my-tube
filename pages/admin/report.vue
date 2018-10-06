<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">사용자 신고 목록</h2>

    <v-layout row wrap class="mb-4">
      <v-flex xs12 class="elevation-1 mb-2 ml-1 mr-1" v-for="(item, index) in reports" :key="index" >
        <v-layout>
          <v-flex style="max-width: 100px" class="mt-2 ml-2 mb-2 mr-2">
            <img width="100px" :src="item.thumb_medium">
          </v-flex>
          <v-flex class="mt-1 mb-1">
            <div>
              <nuxt-link :to="'/admin/item/'+item.item_id">
                <strong>{{ item.item_id }}</strong>
              </nuxt-link>
              <div>{{item.title}}</div>
            </div>
            <div class="small-text">{{item.description}}</div>
            <div class="small-text">{{item.createdDate}}</div>
            <div class="small-text">{{item.uid}} ({{item.name}})</div>
          </v-flex>
          <v-flex style="max-width: 110px; text-align: right" class="mt-1 mr-2">
            <div v-if="item.isshow == 0"  class="small-text">
              <v-btn small outline @click="hideItem(item.item_id, '1')">복구</v-btn>
            </div>
            <div v-else>
              <v-btn :color="$store.state.bcolor" small outline @click="hideItem(item.item_id, '0')">숨김처리</v-btn>
            </div>
          </v-flex>

        </v-layout>
      </v-flex>
    </v-layout>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

  export default {
    async asyncData({app, params, store, query}) {

      let param = {
        page: query.page ? parseInt(query.page) : 1,
        limit: 30,
      };

      const result = await app.$axios.get("/api/video/report/list", {params:param});
      return {
        reports: result.data.reports,
        param: param,
        pageCount : Math.ceil(result.data.count / param.limit),
      }
    },

    methods: {
      getItemsList() {
        this.$axios.get("/api/video/report/list", {params:this.param})
          .then((result)=>{
            this.reports = result.data.reports;
            window.scrollTo(0, 0);
          });
      },

      pageClick() {
        this.$router.push('?page='+this.param.page);
        this.getItemsList();
      },

      hideItem: function(item_id, show) {
        var r = confirm("선택한 비디오의 Show 상태를 바꾸겠습니까?");
        if (r == true) {
          const postparams = {
            "item_id": item_id,
            "show": show
          };

          this.$axios.$post("/api/video/report/hide", {params:postparams})
            .then((result)=>{
              this.getItemsList();
            });
        }
      }
    }
  }

</script>

<style>
</style>
