<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <v-layout row wrap class="mb-2">
      <v-flex xs6>
        <h2 class="mt-2 ml-1 mb-2">큐레이션 관리</h2>
      </v-flex>
      <v-flex xs6 style="text-align: right">
        <v-btn outline :color="$store.state.bcolor" v-on:click="clearCurationFields">큐레이션 추가</v-btn>
      </v-flex>
    </v-layout>

    <div v-for="row in curations" :key="row.id" class="mb-3">

      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-layout row>
          <v-flex sx8>
            <h2>{{row.id}}. {{row.title}}</h2>
          </v-flex>
          <v-flex sx4 style="text-align: right">
            <v-btn outline small color="indigo" v-on:click="addCurationDetail(row.id)">비디오 추가</v-btn>
            <v-btn outline small color="indigo" v-on:click="updateCurationInfo(row)">큐레이션 수정</v-btn>
            <v-btn outline small color="red" v-on:click="deleteCuration(row.id)">큐레이션 삭제</v-btn>
          </v-flex>
        </v-layout>

        <v-layout row class="mb-2">
          <small>
            Description : {{row.description}}<br>
            Category : {{row.category}}<br>
            Tags : {{row.tag}}<br>
            Date : {{row.createdDate}} | Show : {{row.isshow ? "True" : "False"}}
          </small>
        </v-layout>

        <ItemList
          :itemlist="row.details"
        ></ItemList>
      </v-card>

    </div>

    <div class="text-xs-center" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="queryparams.page" :color="$store.state.bcolor"/>
    </div>

    <!--// ADD VIDEO DIALOG-->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="700">
        <v-card class="pl-4 pr-4 pt-4 pb-4">
          <h2>큐레이션에 비디오 추가 - 비디오 번호</h2>
          <v-layout>
            <v-flex xs10>
              <v-text-field
                label="비디오 번호를 입력하세요"
                prepend-inner-icon="video_library"
                v-model="curation_number"
              ></v-text-field>
            </v-flex>

            <v-flex xs2>
              <div style="padding-left: 5px; padding-right: 5px">
                <v-btn :color="$store.state.bcolor" block outline large @click.native="postCurationDetail">추가</v-btn>
              </div>
            </v-flex>
          </v-layout>

          <div class="mt-5"/>
          <h2>큐레이션에 비디오 추가 - 유튜브 링크</h2>
          <v-layout row>
              <YoutubeInput
                :from="'curation'"
                :curation_no="selected_curation_number"
              ></YoutubeInput>
          </v-layout>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outline @click.native="dialog = false">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!--// ADD CURATION DIALOG-->
    <v-layout row justify-center>
      <v-dialog v-model="cdialog" persistent max-width="700">
        <v-card class="pl-4 pr-4 pt-4 pb-4">
          <h1 class="mb-3">큐레이션 추가</h1>
          <v-text-field label="Title" clearable v-model="curationInfo.title"></v-text-field>
          <v-text-field label="Description" clearable v-model="curationInfo.description"></v-text-field>

          <v-layout row wrap>
            <v-flex>
              <v-text-field label="Category" clearable v-model="curationInfo.category"></v-text-field>
            </v-flex>
            <v-flex>
              <v-select :items="category" label="Select Category" v-model="curationInfo.category"></v-select>
            </v-flex>
          </v-layout>

          <v-text-field label="Tag" clearable v-model="curationInfo.tag"></v-text-field>
          <v-checkbox label="Show 여부" v-model="isshow"></v-checkbox>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :color="$store.state.bcolor" outline @click.native="cdialog = false">취소</v-btn>
            <v-btn :color="$store.state.bcolor" outline @click.native="addCurationMaster">저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <!--// UPDATE CURATION DIALOG-->
    <v-layout row justify-center>
      <v-dialog v-model="udialog" persistent max-width="700">
        <v-card class="pl-4 pr-4 pt-4 pb-4">
          <h1 class="mb-3">큐레이션 수정</h1>
          <div v-if="curationInfo">
            <v-text-field label="Title" clearable v-model="curationInfo.title"></v-text-field>
            <v-text-field label="Description" clearable v-model="curationInfo.description"></v-text-field>

            <v-layout row wrap>
              <v-flex>
                <v-text-field label="Category" clearable v-model="curationInfo.category"></v-text-field>
              </v-flex>
              <v-flex>
                <v-select :items="category" label="Select Category" v-model="curationInfo.category"></v-select>
              </v-flex>
            </v-layout>

            <v-text-field label="Tag" clearable v-model="curationInfo.tag"></v-text-field>
            <v-checkbox label="Show 여부" v-model="curationInfo.isshow"></v-checkbox>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :color="$store.state.bcolor" outline @click.native="udialog = false">취소</v-btn>
            <v-btn :color="$store.state.bcolor" outline @click.native="postCurationInfo">저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </component>

</template>

<script>

  import ItemList from '~/components/admin/item-list'
  import YoutubeInput from '~/components/youtube-input'

  export default {

    components: {
      ItemList,
      YoutubeInput
    },

    async asyncData({app, params, store, query}) {

      let queryparams = {
        page: query.page ? parseInt(query.page) : 1,
        limit: 3,
      };

      const result = await app.$axios.$get("/api/curation/master", {params:queryparams});
      return {
        tubelink: null,
        curation_number: null,
        selected_curation_number: null,
        cdialog: false,
        udialog: false,
        dialog: false,
        curations: result.curations,
        cdetails: [],
        category: [],
        isshow: 1,
        curationInfo: {
          title: null,
          description: null,
          category: null,
          tag: null
        },
        queryparams: queryparams,
        pageCount : Math.ceil(result.count / queryparams.limit),
      }
    },


    mounted() {
      this.$root.$on("ReloadCurationList", (result) =>{
        this.dialog = false;
        this.getCurationMaster();
      });

      this.getCategory();
    },

    methods: {

      getCategory() {
        this.$axios.$get("/api/category")
          .then((result)=>{
            this.category = [];
            result.result.forEach((item)=>{
              if (item.category){
                this.category.push(item.category);
              }
            })
          })
      },

      getCurationMaster() {
        this.$axios.$get("/api/curation/master", {params:this.queryparams})
          .then((result)=>{
            this.curations = result.curations;
            window.scrollTo(0, 0);
          })
      },

      getCurationDetail(curid) {
        const params = {curationid : curid}
        this.$axios.$get("/api/curation/details", {params: params})
          .then((result)=>{
            this.cdetails = result.details;
          });
      },

      clearCurationFields() {
        this.curationInfo = {
          title: null,
          description: null,
          category: null,
          tag: null
        }
        this.cdialog = true;
      },

      addCurationMaster() {
        this.cdialog = false;

        const createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const postparams = {
          "createdDate": createDate,
          "creator_id": this.$store.state.user.uid,
          "title": this.curationInfo.title,
          "description": this.curationInfo.description,
          "category": this.curationInfo.category,
          "tag": this.curationInfo.tag,
          "isshow": this.isshow
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/add", {params:postparams})
          .then((result)=>{
            if (result.err) {
              alert(result.err);
            }
            this.getCurationMaster();
          });
      },

      addCurationDetail(curid) {
        this.selected_curation_number = curid;
        this.curation_number = null;
        this.tubelink = null;
        this.dialog = true;
      },

      postCurationDetail() {
        this.dialog = false;

        if (this.curation_number) {
          const postparams = {
            "master_id": this.selected_curation_number,
            "creator_id": this.$store.state.user ? this.$store.state.user.uid : null,
            "item_id": this.curation_number
          };

          this.$axios.$post("/api/curation/adddetail", {params:postparams})
            .then((result)=>{
              if (result.err) {
                if (result.err.sqlMessage) {
                  alert(result.err.sqlMessage);
                } else {
                  alert(result.err);
                }
              } else {
                this.getCurationMaster();
              }
            })

        } else {
          alert("비디오 번호를 입력하세요.");
        }

      },

      deleteCuration(curid) {

        var r = confirm("선택한 큐레이션을 삭제 하겠습니까?, 모든 자료가 삭제 됩니다.");
        if (r == true) {

          const postparams = {
            "curid": curid
          };

          this.$axios.$post("/api/curation/delete", {params:postparams})
            .then((result)=>{
              if (result.err) {
                if (result.err.sqlMessage) {
                  alert(result.err.sqlMessage);
                } else {
                  alert(result.err);
                }
              } else {
                this.getCurationMaster();
              }
            });
        }

      },

      pageClick() {
        this.$router.push('?page='+this.queryparams.page);
        this.getCurationMaster();
      },

      updateCurationInfo(curation) {
        this.udialog = true;

        this.curationInfo = {
          title:curation.title,
          description:curation.description,
          category: curation.category,
          tag: curation.tag,
          id: curation.id,
          isshow: curation.isshow
        }
      },

      postCurationInfo() {

        this.udialog = false;
        const postparams = {
          "id": this.curationInfo.id,
          "title": this.curationInfo.title,
          "description": this.curationInfo.description,
          "tag":this.curationInfo.tag,
          "category":this.curationInfo.category,
          "isshow": this.curationInfo.isshow ? 1 : 0
        };

        // POST TO DB SERVER
        this.$axios.$post("/api/curation/update", {params:postparams})
          .then((result)=>{
            if (result.err) {
              if (result.err.sqlMessage) {
                alert(result.err.sqlMessage);
              } else {
                alert(result.err);
              }
            } else {
              this.getCurationMaster();
            }
          });

      },


    }
  }
</script>

<style>
</style>
