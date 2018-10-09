<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">로그인</h2>

    <v-card class="signup-box mt-3">
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <form @submit.prevent="startLogin">
              <v-text-field label="이메일"  clearable v-model="user.email"></v-text-field>
            </form>
            <form @submit.prevent="startLogin">
              <v-text-field label="패스워드" clearable type="password" v-model="user.password"></v-text-field>
            </form>
            <v-checkbox v-model="rememberme" label="로그인 상태 유지"></v-checkbox>

            <v-btn block :color="$store.state.bcolor" dark outline @click="startLogin" class="mt-4">
              로그인
            </v-btn>
            <v-btn :color="$store.state.bcolor" block dark outline to="/user/signup" class="mt-3">
              회원가입
            </v-btn>

          </div>
        </v-flex>
        <v-flex xs12 sm6>
          <div class="signup-box-inside">
            <div class="detail-text mt-4">
              이 서비스는 오픈소스 프로젝트(my-tube)를 이용하여 개발되었습니다. 이 프로젝트에 대한 상세한 정보는 아래 버튼을 눌러서 확인 할 수 있습니다.
            </div>
            <v-btn color="grey" block dark outline href="https://github.com/bipark/my-tube" target="_blank" class="mt-4">
              오픈소스 프로젝트 My-Tube
            </v-btn>

          </div>

        </v-flex>
      </v-layout>
    </v-card>

  </component>

</template>

<script>

  export default {

	  async asyncData({app, params, store, query}) {

		  return {
		  	user: {
				  email: "",
				  password: "",
        },
			  rememberme: false,
			  redirect: params.redirect
		  }
	  },

	  mounted() {
		  const rememberme = this.$cookies.get("rememberme");

		  if (rememberme && rememberme.rememberme) {
			  this.user.email = rememberme.email;
			  this.user.password = rememberme.password;
			  this.rememberme = rememberme.rememberme;
		  }
	  },

    methods: {
	    startLogin() {
		    const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		    if (this.user.email.length > 0 && emailValidator.test(this.user.email) ){
			    if (this.user.password.length > 0 ) {

				    if (this.rememberme) {
					    const user = {
						    "email": this.user.email,
						    "password": this.user.password,
						    "rememberme": this.rememberme
					    };

					    this.$cookies.set("rememberme", user, {
						    path: "/",
						    maxAge: 60 * 60 * 24 * 30
					    });
				    } else {
					    this.$cookies.remove("rememberme");
				    }

				    let reqAddress = '/api/user/signin';
            const postparams = {
              "user": this.user
            };

            this.$axios.post(reqAddress, postparams)
              .then((result)=>{
                if (result.data.err){
                  alert(result.data.err);
                } else {
                  // // Save User Data
                  this.$store.commit("setUser", result.data.user);

	                if (this.redirect) {
		                this.$router.push(this.redirect);
	                } else {
		                this.$router.push('/');
	                }

                }
              })
              .catch((err)=>{
              	alert(err)
              })

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

  .login-button {
    min-height: 60px;
    min-width: 300px;
    margin: 10px;
  }

</style>
