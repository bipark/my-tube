<template>

  <v-container>
    <h1 class="mb-3">for iOS</h1>

    <div class="img-cont">
      <div v-for="(item, i) in items" :key="i" class="img-item">
        <img :src="item.src" width="200px"/>
      </div>
    </div>

    <div style="text-align: center" class="mt-5">
      <a href="https://itunes.apple.com/kr/app/id1440408457?mt=8" target="_blank">
        <img src="@/assets/images/apple_download.svg" width="160px">
      </a>
    </div>
  </v-container>

</template>

<script>
  export default {
  	data() {
  		return {
  			items: [
          { src :"https://s3.ap-northeast-2.amazonaws.com/rtlink/app/app_ios1.jpg" },
				  { src :"https://s3.ap-northeast-2.amazonaws.com/rtlink/app/app_ios2.jpg" },
				  { src :"https://s3.ap-northeast-2.amazonaws.com/rtlink/app/app_ios3.jpg" },
				  { src :"https://s3.ap-northeast-2.amazonaws.com/rtlink/app/app_ios4.jpg" },
				  { src :"https://s3.ap-northeast-2.amazonaws.com/rtlink/app/app_ios5.jpg" }
        ]
      }
    }
  }
</script>

<style scoped>
  .img-cont {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .img-item {
    display: inline-block;
  }
</style>
