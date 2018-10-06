<template>

  <div>

    <div v-if="user" class="text-xs-center">
      <v-menu bottom left>
        <v-avatar size="24px" tile slot="activator">
          <img :src="user && user.picture">
        </v-avatar>
        <v-card>
          <v-list dense>

            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="user && user.picture">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{user && user.name}}</v-list-tile-title>
                <v-list-tile-title>{{user && user.uid}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>

            <template v-for="item in items3">
              <v-list-tile :key="item.to" v-on:click.native="menuRouter(item.to)">
                <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

          </v-list>
        </v-card>
      </v-menu>

    </div>

    <div v-else>
      <nuxt-link to="/login" style="color: white">로그인</nuxt-link>
    </div>

  </div>

</template>

<script>
	export default {

		data() {
			return {
				items3: [
					{icon: "person", text: "프로필", to: "/user/profile"},
					{icon: "security", text: "패스워드 변경", to: "/user/changepassword"},
					{icon: "publish", text: "의견보내기", to: "/user/contact"},
					{icon: "input", text: "로그아웃", to: "/logout"},
				]
			}
		},

		computed: {
			user() {
				return this.$store.state.user
			}
		},

		methods: {

			menuRouter(to) {
				if (to == "/logout") {
					this.$store.dispatch("logOut")
					location.reload();
				} else if (to == "/login_google") {
					this.$store.dispatch("signWithGoogle")
				} else if (to == "/login_facebook") {
					this.$store.dispatch("signWithFacebook")
				} else {
					this.$router.push(to);
				}
			},

		}

	}
</script>
