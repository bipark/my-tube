<template>

  <v-layout row wrap>
    <v-flex xs6 sm4 lg2 xl2 v-for="(item, i) in itemlist" :key="item.id">
      <VideoCard
        :item="item"
        :curation="curation"
        :count="i"
      ></VideoCard>
    </v-flex>
  </v-layout>

</template>

<script>

  import VideoCard from '~/components/video-card'

  export default {
    components: {
      VideoCard
    },
    props: {
      "itemlist": {
        type: Array,
        default: []
      },
      "curation": {
        type: [Number, String],
        default: null
      }
    },

    mounted() {
    },

    methods: {
    }

  }
</script>

<style>
</style>
