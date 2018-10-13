<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <v-layout row wrap class="mb-2">
      <v-flex xs6>
        <h2 class="mt-2 ml-1 mb-2">공지사항</h2>
      </v-flex>
      <v-flex xs6 style="text-align: right">
        <v-btn outline :color="$store.state.bcolor" v-on:click="showInputDialog">공지사항 추가</v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="mb-4"/>

    <v-layout v-for="(item, index) in notices" :key="index" class="mb-2">
      <v-card style="width: 100%; padding: 20px">
        <div v-html="item.title"></div>
        <div v-html="item.description" class="mt-3 mb-1"></div>
        <div class="small-text mb-3">{{item.created}}</div>
        <v-icon class="mr-2" @click="editNotice(item)">edit</v-icon>
        <v-icon @click="deleteNotice(item.id)">delete</v-icon>
      </v-card>
    </v-layout>

    <div class="text-xs-center mt-5" @click="pageClick">
      <v-pagination :length="pageCount" :total-visible="6" v-model="param.page" :color="$store.state.bcolor"/>
    </div>

    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="700">

        <v-card class="pl-4 pr-4 pt-4 pb-4">
          <h1 class="mb-3">공지사항 추가</h1>
          <form @submit.prevent="saveNotice" class="mt-4 mb-1">
            <div>제목 (HTML 사용 가능)</div>
            <v-text-field clearable solo v-model="title"></v-text-field>
            <div>공지사항 (HTML 사용 가능)</div>
            <v-textarea rows="8" clearable solo v-model="description"></v-textarea>
          </form>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :color="$store.state.bcolor" outline @click.native="dialog = false">취소</v-btn>
            <v-btn :color="$store.state.bcolor" outline @click.native="saveNotice">저장</v-btn>
          </v-card-actions>

        </v-card>

      </v-dialog>
    </v-layout>


  </component>

</template>

<script>
	export default {

		async asyncData({app, params, store, query}) {

			let param = {
				page: params.page ? parseInt(params.page) : 1,
				limit: 10,
        all: true
			};

			const result = await app.$axios.get("/api/notice/list", {params:param});
			return {
				dialog: false,
        edit: false,
        notice_id: null,
				title: '',
				description: '',
				notices: result.data.notices,
				param: param,
				pageCount : Math.ceil(result.data.count / param.limit),
			}
		},

		methods: {

			getItemsList() {
				this.$axios.get("/api/notice/list", {params:this.param})
					.then((result)=>{
						this.notices = result.data.notices;
						window.scrollTo(0, 0);
					});
			},

			saveNotice() {
				if (this.title.length > 0 && this.description.length > 0) {

					let actionUrl = "/api/notice/add";
					let postparams = {
						"title": this.title,
						"description": this.description
					};

					if (this.edit) {
						actionUrl = "/api/notice/update";
						postparams.id = this.notice_id;
          }

					this.$axios.post(actionUrl, {params:postparams})
						.then((result)=>{
							this.edit = false;
							this.dialog = false;
							this.getItemsList();
						});
				} else {
					alert("내용을 입력하고 저장을 누르세요");
				}

			},

			clear() {
				this.title = '';
				this.description = '';
			},

			pageClick() {
				this.$router.push('/admin/notice/'+this.param.page);
				this.getItemsList();
			},

      showInputDialog() {
				this.clear();
				this.dialog = true;
      },

			hideNotice(id, value) {
				var r = confirm("선택한 공지사항을 숨김처리 하겠습니까?");
				if (r == true) {
					const postparams = {
						"id": id,
						"active": value
					};

					this.$axios.$post("/api/notice/hide", {params:postparams})
						.then((result)=>{
							this.getItemsList();
						});
				}
			},

			deleteNotice(id) {
				var r = confirm("선택한 공지사항을 삭제 하겠습니까?");
				if (r == true) {
					const postparams = {
						"id": id
					};

					this.$axios.$post("/api/notice/delete", {params:postparams})
						.then((result)=>{
							this.getItemsList();
						});
				}
			},

      editNotice(item) {
				this.notice_id = item.id;
	      this.title = item.title;
	      this.description = item.description;
	      this.edit = true;
	      this.dialog = true;
      }

		}

	}

</script>
