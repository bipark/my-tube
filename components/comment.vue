<template>

  <div>

    <div v-if="$store.state.user">
      <v-layout class="comment-input mt-2 mb-3 pl-2 pr-2">
        <v-flex>
          <v-textarea
            label="댓글달기"
            rows="2"
            clearable
            ref="comment"
            v-model="comment">
          </v-textarea>
        </v-flex>
        <v-flex style="max-width: 100px">
          <v-btn :color="$store.state.bcolor" outline @click.native="saveComment()">추가</v-btn>
        </v-flex>
      </v-layout>
    </div>

    <v-layout v-for="(item, index) in comlist" :key="index" class="mb-2">
      <v-flex class="pl-2 pr-2 pt-2" style="max-width: 54px">
        <v-avatar size="40px">
          <img :src="item.picture">
        </v-avatar>
      </v-flex>
      <v-flex class="ml-1 pt-1">
        <div style="color: #47494e; font-size: 12px;">
          {{item.comment}}
          <span class="small-text">
            {{item.createdDate}}
          </span>
        </div>
        <div class="small-text">
          {{item.name}}
        </div>
        <div v-if="$store.state.user">
          <div v-if="item.uid == $store.state.user.uid">
            <v-icon small @click="deleteComment(item.id)">delete</v-icon>
            <v-icon small class="mr-2" @click="editComment(item)">edit</v-icon>
          </div>
        </div>
      </v-flex>

    </v-layout>

  </div>

</template>

<script>
	export default {

		props: {
			"item_id": {
				type: [String, Number],
				default: null
			}
		},

		data(){
			return {
				comment: "",
        comment_id: null,
        edit: false,
        comlist: []
			}
    },

    mounted() {
	    this.$root.$on("ChangeItem", (item_id) =>{
	    	this.item_id = item_id;
		    this.getCommentList();
		    return;
	    });

	    this.getCommentList();
    },

    methods: {

			getCommentList() {
				this.$axios.get("/api/comment/list", {params:{item_id:this.item_id}})
					.then((result)=>{
						this.edit = false;
						this.comlist = result.data.comments;
					});
      },

			saveComment() {
				if (!this.$store.state.user){
					this.$router.push({ name: "login", params: { redirect: this.$route.path }});
					return;
				}

				if (this.comment.length > 0) {

					let actionUrl = "/api/comment/add";
					let postparams = {
						"comment": this.comment,
            "item_id": this.item_id,
						"creator_id": this.$store.state.user.uid
					};

					if (this.edit) {
						actionUrl = "/api/comment/update";
						postparams.id = this.comment_id;
					}

          this.comment = "";
					this.$axios.post(actionUrl, {params:postparams})
						.then((result)=>{
							this.edit = false;
							this.getCommentList();
						});
				} else {
					alert("내용을 입력하고 저장을 누르세요");
				}

			},

	    deleteComment(item_id) {
		    var r = confirm("선택한 댓글을 삭제 하겠습니까?");
		    if (r == true) {
			    const postparams = {
				    "id": item_id
			    };

			    this.$axios.$post("/api/comment/delete", {params:postparams})
				    .then((result)=>{
					    this.getCommentList();
				    });
		    }
	    },

	    editComment(item) {
				this.comment_id = item.id;
        this.comment = item.comment;
        this.edit = true;
        this.$refs.comment.focus();
      }

    }

	}
</script>
