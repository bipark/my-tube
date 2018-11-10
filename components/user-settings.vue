<template>

  <div>
    <v-layout row wrap class="ml-4 mr-4 mt-2">
      <v-flex sx6>
        <v-switch label="동영상 자동 플레이" v-model="$store.state.user.autoplay" @change="changeDatas"></v-switch>
      </v-flex>
      <v-flex sx6>
        <v-switch label="노티피케이션 수신" v-model="$store.state.user.recvnoti" @change="changeDatas"></v-switch>
      </v-flex>
    </v-layout>
  </div>

</template>

<script>
	export default {

    methods: {
			changeDatas() {
				const postparams = {
					"uid": this.$store.state.user.uid,
					"autoplay":this.$store.state.user.autoplay,
					"recvnoti":this.$store.state.user.recvnoti,
				};
				this.$axios.$post("/api/user/change/status", {params:postparams});
			},

    }

	}
</script>
