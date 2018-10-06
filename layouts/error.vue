<template>

  <v-container>
    <div class="mt-5" style="width: 100%">
      <div class="error_title">
        사용할 수 없는 페이지이거나 페이지에 오류가 발생 했습니다.<br/>
        버튼을 누르면 홈으로 이동합니다.<br/>
        <v-btn outline color="blue-grey lighten-1" class="mt-3 mb-3" to="/">
          홈으로
        </v-btn>
      </div>
    </div>
  </v-container>

</template>

<script>
  export default {
  }
</script>

<style>

  .error_title {
    font-size: 16px;
    text-align: center;
  }

</style>
