<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">사용자 의견 목록</h2>

    <v-layout row wrap class="mb-4">
      <v-flex xs12 class="elevation-1 mb-2 ml-1 mr-1" v-for="(item, index) in contacts" :key="index" >
        <v-layout>
          <v-flex style="max-width: 44px" class="mt-2 ml-2 mb-2 mr-2">
            <v-avatar size="44px">
              <img :src="item.picture">
            </v-avatar>
          </v-flex>
          <v-flex class="mt-1 mb-1">
            <div>{{item.title}}</div>
            <div class="small-text">{{item.description}}</div>
            <div class="small-text">{{item.created}}</div>
            <div class="small-text">{{item.email}} ({{item.name}})</div>
          </v-flex>
          <v-flex style="max-width: 110px; text-align: right" class="mt-1 mr-2">
            <div v-if="item.processed"  class="small-text">
              {{ item.processed }}
            </div>
            <div v-else>
              <v-btn :color="$store.state.bcolor" small outline @click="processItem(item.id)">확인</v-btn>
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
				page: params.page ? parseInt(params.page) : 1,
				limit: 30,
			};

			const result = await app.$axios.get("/api/contact/list", {params:param});
			return {
				contacts: result.data.contacts,
				param: param,
				pageCount : Math.ceil(result.data.count / param.limit),
			}
		},

		methods: {
			getItemsList() {
				this.$axios.get("/api/contact/list", {params:this.param})
					.then((result)=>{
						this.contacts = result.data.contacts;
						window.scrollTo(0, 0);
					});
			},

			pageClick() {
				this.$router.push('/admin/contact/'+this.param.page);
				this.getItemsList();
			},

			processItem: function(id) {
				var r = confirm("확인 처리 하겠습니까?");
				if (r == true) {
					const postparams = {
						"id": id
					};

					this.$axios.$post("/api/contact/process", {params:postparams})
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
