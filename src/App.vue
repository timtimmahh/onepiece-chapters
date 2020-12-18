<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  beforeCreate() {
    this.$store.dispatch('updateMedia')
    this.$store.dispatch('updateChapters')
    this.$store.dispatch('updatePages')
  },
  mounted() {

  }
}
</script>
