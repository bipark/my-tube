<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <vue-markdown
      :source="nayong"
    ></vue-markdown>
  </component>

</template>

<script>

  import VueMarkdown from 'vue-markdown';

  export default {

    components: {
      'vue-markdown': VueMarkdown
    },

    async asyncData({app, params, store, query}) {

      const result = await app.$axios.get("/api/info/"+params.info);

      return {
        info : params.info,
        nayong : result.data.content.content
      }
    },

  }

</script>
