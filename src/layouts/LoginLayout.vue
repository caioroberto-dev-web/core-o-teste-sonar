<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LoginLayout'
}
</script>

<style scoped>
.q-page-container {
  padding-left: 0 !important;
}
</style>
