<template>

  <component :is="$store.state.mobile ? 'div': 'v-container'">
    <div>
      <h1>Admin</h1>
    </div>
  </component>

</template>

<script>
  export default {
  }
</script>
