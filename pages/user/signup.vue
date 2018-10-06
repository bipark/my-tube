<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <h2 class="mt-2 ml-1 mb-2">회원가입</h2>

    <v-card class="signup-box mt-3">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <form @submit.prevent="startSignUp">
              <v-text-field label="이름" clearable v-model="user.name"></v-text-field>
              <v-text-field label="이메일" clearable v-model="user.email"></v-text-field>
              <v-text-field label="패스워드" clearable type="password" v-model="user.password1"></v-text-field>
              <v-text-field label="패스워드 확인" clearable type="password" v-model="user.password2"></v-text-field>
            </form>
            <v-btn block :color="$store.state.bcolor" dark outline @click="startSignUp" class="mt-4">
              회원가입
            </v-btn>
          </div>

        </v-flex>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <div class="detail-text mt-4">
              cfvdo.com 은 광고 동영상 큐레이션 서비스 입니다. 재미있고 기억에 남을만한 광고를 카테고리별로 모아서 한번에 모두 볼 수 있도록 만들고 있습니다. 좋은 의견을 보내 주시면 서비스에 반영하겠습니다.
            </div>
            <v-btn color="grey" block dark outline to="/user/contact" class="mt-4">
              의견 보내기
            </v-btn>
            <div class="detail-text mt-4">
              이 서비스는 오픈소스 프로젝트(my-tube)를 이용하여 개발되었습니다. 이 프로젝트에 대한 상세한 정보는 아래 버튼을 누르세요.
            </div>
            <v-btn color="grey" block dark outline href="https://github.com/bipark/my-tube" target="_blank" class="mt-4">
              오픈소스 프로젝트 my-tube
            </v-btn>

          </div>
        </v-flex>

      </v-layout>

    </v-card>
  </component>

</template>

<script>
	export default {

		data() {
			return {
				user: {
					name: "",
					email: "",
					password1: "",
					password2: ""
        }
      }
    },

    methods: {
			startSignUp() {
				const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

				if (this.user.email.length > 0 && emailValidator.test(this.user.email) ){
					if (this.user.password1.length > 0 && this.user.password2.length > 0) {
						if (this.user.password1 === this.user.password2) {

							let reqAddress = '/api/user/signup';
							const postparams = {
								"user": this.user
							};

							this.$axios.post(reqAddress, postparams)
								.then((result)=>{
									if (result.data.err){
										alert(result.data.err);
									} else {
										// Save User Data
										this.$store.commit("setUser", result.data.account);
										this.$router.push('/');
									}
								});

						} else {
							alert("패스워드가 일치하지 않습니다.")
            }

					} else {
						alert("패스워드는 반드시 입력해야 합니다.")
					}
				} else {
					alert("이메일 형식이 맞지 않습니다.")
				}

			}
    }
	}
</script>

<style scoped>
</style>
