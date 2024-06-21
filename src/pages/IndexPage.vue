<template>
  <q-page>
    <div class="row spacing-top"></div>
  </q-page>
</template>

<script>
export default {
  name: 'LoginForm',
  data () {
    return {
      username: ''
    }
  },
  mounted () {
    this.username = sessionStorage.getItem('username') || 'Usuário'
  }
}
</script>

<style scoped>
.LoginContainer {
  width: 80%;
  display: block;
  margin: 0 auto;
}

img {
  display: block;
  height: 100px;
  margin: 20px auto;
}

.col-md-6, .col-xs-6 {
  margin: 15px auto;
}

label {
  font-size: 24px;
  color: #504949;
}

@media (max-width: 576px) {
  .q-btn {
    border-radius: 10px;
    width: 100%;
  }
}
</style>
