<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">

    <h2 class="mt-2 ml-1 mb-2">공지사항</h2>

    <div v-if="notice">
      <v-card class="ml-1 mr-1">
        <v-card-title  primary-title >
          <h3 class="headline mb-0" v-html="notice.title"></h3>
        </v-card-title>

        <v-card-text v-html="notice.description"></v-card-text>
        <v-card-text>{{notice.created}}</v-card-text>
      </v-card>
    </div>

  </component>

</template>

<script>
	export default {

		async asyncData({app, params, store, query}) {
			const result = await app.$axios.get("api/notice?id="+params.id);
			return {
				notice:result.data.notice
			}
		},

	}
</script>
