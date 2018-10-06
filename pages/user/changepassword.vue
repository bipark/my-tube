<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">패스워드변경</h2>
    <v-card class="signup-box mt-3 ml-1 mr-1">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <form @submit.prevent="startLogin">
              <v-text-field label="이전 패스워드" clearable type="password" v-model="password0"></v-text-field>
              <v-text-field label="새 패스워드" clearable type="password" v-model="password1"></v-text-field>
              <v-text-field label="새 패스워드 확인" clearable type="password" v-model="password2"></v-text-field>
            </form>
            <v-btn block :color="$store.state.bcolor" dark outline @click="changePassword" class="mt-4">
              패스워드 변경
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <div class="detail-text mt-4">
              이 서비스는 오픈소스 프로젝트(my-tube)를 이용하여 개발되었습니다. 이 프로젝트에 대한 상세한 정보는 아래 버튼을 눌러서 확인 할 수 있습니다.
            </div>
            <v-btn color="grey" block dark outline href="https://github.com/bipark/my-tube" target="_blank" class="mt-4">
              오픈소스 프로젝트 MY-TUBE
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
        password0: "",
        password1: "",
        password2: "",
			}
		},

		mounted() {
		},

		methods: {

			changePassword() {
				if (this.password0.length > 0 && this.password1.length > 0 && this.password2.length > 0) {

					if (this.password1 === this.password2 ) {

						let reqAddress = '/api/user/change/password';
						const postparams = {
							"email": this.$store.state.user.uid,
							"password0": this.password0,
							"password1": this.password1
						};

						this.$axios.post(reqAddress, postparams)
							.then((result)=>{
								if (result.data.err){
									alert(result.data.err);
								} else {
									alert('패스워드가 수정 되었습니다.');
									this.$router.push('/');
								}
							});

					} else {
						alert("패스워드가 일치하지 않습니다.")
					}

				} else {
					alert("패스워드는 반드시 입력해야 합니다.")
				}

			}
		}

	}
</script>

<style scoped>

  .login-button {
    min-height: 60px;
    min-width: 300px;
    margin: 10px;
  }

</style>
