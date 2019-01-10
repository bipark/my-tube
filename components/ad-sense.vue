<template>

  <div v-if="showad">
    <v-layout row>
      <div class="adsense mt-3 mb-4">
        <adsbygoogle
          ad-slot="3507616933"
          class="example_responsive_1"
        />
      </div>
    </v-layout>
  </div>

</template>

<script>
  export default {
  	computed: {
  		showad() {
  			return process.env.showad;
      }
    }
  }
</script>

<style scoped>

  .adsense {
    width: 100%;
    text-align: center;
    display:inline-block;
  }

</style>
