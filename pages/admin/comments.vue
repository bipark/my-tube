<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">댓글 목록</h2>

    <v-layout row wrap>
      <v-flex xs12 class="elevation-1 mb-2 ml-1 mr-1" v-for="(item, index) in comments" :key="index" >
        <v-layout>
          <v-flex style="max-width: 44px" class="mt-2 ml-2 mb-2 mr-2">
            <v-avatar size="44px">
              <img :src="item.picture">
            </v-avatar>
          </v-flex>
          <v-flex class="mt-1 mb-1">
            <div>{{item.comment}}</div>
            <div class="small-text">{{item.createdDate}}</div>
            <div class="small-text">{{item.uid}} ({{item.name}})</div>
          </v-flex>
          <v-flex style="max-width: 24px" class="mt-1">
            <v-icon @click="deleteComment(item.id)">delete</v-icon>
          </v-flex>

        </v-layout>
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
				page: query.page ? parseInt(query.page) : 1,
				limit: 10,
			};

			const result = await app.$axios.get("/api/comment/list/all", {params:param});
			return {
				comments: result.data.comments,
				param: param,
				pageCount : Math.ceil(result.data.count / param.limit),
			}
		},

		methods: {
			getItemsList() {
				this.$axios.get("/api/comment/list/all", {params:this.param})
					.then((result)=>{
						this.comments = result.data.comments;
						window.scrollTo(0, 0);
					});
			},

			pageClick() {
				this.$router.push('?page='+this.param.page);
				this.getItemsList();
			},

			deleteComment: function(item_id) {
				var r = confirm("선택한 댓글을 삭제 할까요?");
				if (r == true) {
					const postparams = {
						"id": item_id
					};

					this.$axios.$post("/api/comment/delete", {params:postparams})
						.then((result)=>{
							this.getItemsList();
						});
				}
			}
		}
	}


</script>
