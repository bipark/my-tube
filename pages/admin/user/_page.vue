<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">회원관리</h2>

    <v-card style="padding: 8px" class="ml-1 mr-1">
      <v-layout row wrap>
        <v-flex class="mr-2 ml-2">
          <v-select :items="menus" label="검색" v-model="selectKind" @change="changeSelect" dense/>
        </v-flex>
        <v-flex class="ml-2 mr-2">
          <form @submit.prevent="startSearch">
            <v-text-field :label=searchTitle clearable v-model="searchText"/>
          </form>
        </v-flex>
        <v-btn block :color="$store.state.bcolor" dark outline large primary @click="startSearch" class="ml-2 mr-2 mb-4">
          검색
        </v-btn>
      </v-layout>
    </v-card>

    <v-divider class="mb-4"/>

    <v-layout row wrap class="mb-2">
      <v-flex  xs12 sm6 lg4 xl4 v-for="(item, index) in users" :key="index" style="padding: 3px">
        <v-card style="padding: 8px">
          <v-layout>
            <v-flex style="max-width: 44px" class="mt-2 ml-2 mb-2 mr-2">
              <v-avatar size="44px">
                <img :src="item.picture">
              </v-avatar>
            </v-flex>
            <v-flex>
              <div class="detail-text2">{{item.createdDate}}</div>
              <div class="detail-text2">{{item.uid}}</div>
              <div class="detail-text2">{{item.name}} ({{item.scope}})</div>
            </v-flex>

            <v-flex style="max-width: 50px">
              <v-menu bottom left>
                <v-btn slot="activator" icon>
                  <v-icon>more_horiz</v-icon>
                </v-btn>

                <v-list dense>
                  <v-list-tile @click="deleteUser(item.id)">
                    <v-list-tile-action>
                      <v-icon>delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>회원삭제</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <div v-if="item.scope == 'user'">
                    <v-list-tile @click="upgradeUser(item.id)">
                      <v-list-tile-action>
                        <v-icon>merge_type</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>관리자로 변경</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </div>
                </v-list>

              </v-menu>
            </v-flex>
          </v-layout>

        </v-card>

      </v-flex>
    </v-layout>


    <div class="text-xs-center mt-5" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

  </component>

</template>

<script>

  export default {
    async asyncData({app, params, store, query}) {

      let param = {
	      page: params.page ? parseInt(params.page) : 1,
        limit: 30,
      };

      const result = await app.$axios.get("/api/user/list", {params:param});
      return {
        users: result.data.users,
        param: param,
        pageCount : Math.ceil(result.data.count / param.limit),
	      menus: ["회원이름", "이메일"],
        selectKind: "회원이름",
	      searchTitle: "검색 - 회원이름",
	      searchText: null,
      }
    },

    methods: {
      getUserList() {
        this.$axios.get("/api/user/list", {params:this.param})
          .then((result)=>{
            this.users = result.data.users;
            window.scrollTo(0, 0);
          });
      },

      pageClick() {
	      this.$router.push('/admin/user/'+this.param.page);
        this.getUserList();
      },

      upgradeUser: function(id) {
        var r = confirm("선택한 사용자를 관리자로 지정 하겠습니까?");
        if (r == true) {
          const postparams = {"id": id};

          this.$axios.$post("/api/user/change/scope", {params:postparams})
            .then((result)=>{
              this.getUserList();
            });
        }
      },

      deleteUser: function(id) {
        var r = confirm("선택한 사용자를 삭제하겠습니까?");
        if (r == true) {
          const postparams = {"id": id};

          this.$axios.$post("/api/user/delete", {params:postparams})
            .then((result)=>{
              this.getUserList();
            });
        }
      },

	    changeSelect(value) {
		    this.searchTitle = value;
		    this.selectKind = value;
	    },

      startSearch() {

	      let param = {
		      page: 1,
		      limit: 30,
          kind: (this.selectKind == '회원이름') ? "name" : "uid",
          search: this.searchText
	      };

	      this.$axios.get("/api/user/list", {params:param})
		      .then((result)=>{
			      this.users = result.data.users;
			      window.scrollTo(0, 0);
		      });

      }

    }
  }

</script>

<style>
</style>
