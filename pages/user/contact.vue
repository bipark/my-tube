<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">의견 보내기</h2>

    <v-card style="padding: 20px">
      <v-layout row>
        <div class="detail-text ml-1 mr-1">궁금하신 사항이나 문의하실 내용을 보내 주시면 빠른 시간내에 응답 드리도록 하겠습니다.</div>
      </v-layout>

      <form @submit.prevent="sendMail" class="mt-4 mb-1">
        <div class="detail-text">제목</div>
        <v-text-field clearable solo v-model="title"></v-text-field>
        <div class="detail-text">문의사항</div>
        <v-textarea rows="12" clearable solo v-model="description"></v-textarea>
      </form>

      <v-btn outline color="blue-grey lighten-1" class="mt-3" @click="sendMail">
        <div class="detail-text">보내기</div>
      </v-btn>
      <v-btn outline color="blue-grey lighten-1" class="mt-3" @click="clear">
        <div class="detail-text">지우기</div>
      </v-btn>
    </v-card>

  </component>

</template>

<script>

	export default {

		data() {
			return {
				title: '',
				description: ''
			}
		},

		methods: {

			sendMail() {

				if (this.title.length > 0 && this.description.length > 0) {
					const postparams = {
						"title": this.title,
						"email": this.$store.state.user.uid,
						"description": this.description
					};

					this.$axios.post("/api/contact/add", {params:postparams})
						.then((result)=>{
							alert("감사합니다. \n빠른시간내에 내용 확인하고 조치하겠습니니다.");
							this.$router.push('/');
						});
				} else {
					alert("내용을 입력하고 보내기를 누르세요");
				}

			},

			clear() {
				this.title = '';
				this.email =  '';
				this.description = '';
			}

		}

	}
</script>
