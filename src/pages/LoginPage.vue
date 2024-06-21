<template>
  <q-page class="flex flex-center login-page">
    <q-card class="login-card">
      <q-form @submit="login">
        <q-card-section class="text-center">
          <img src="../assets/logo.png" alt="Logo" class="login-logo" />
          <p class="text-h6 login-title">CORE-O</p>
        </q-card-section>

        <q-card-section>
          <div class="input-group">
            <label for="email">E-mail:</label>
            <q-input for="email"
              type="email"
              class="custom-input"
              v-model="email"
              lazy-rules
              :rules="[
                val => ruleRequired(val) || 'Campo obrigatório.',
                val => ruleEmail(val) || 'E-mail inválido.'
              ]"
              :error-message="getValidationErrors('generalErrors')"
              :error="hasValidationErrors('generalErrors')"
              />
          </div>

          <div class="input-group">
            <label for="password">Senha:</label>
            <q-input for="password"
            v-model="password"
              type="password"
              class="custom-input"
              lazy-rules
              :rules="[val => ruleRequired(val) || 'Campo obrigatório.']"
              :error-message="getValidationErrors('generalErrors')"
              :error="hasValidationErrors('generalErrors')"/>
          </div>
        </q-card-section>

        <q-card-actions class="no-shadow" align="center">
          <q-btn class="login-button" label="ENTRAR" type="submit" />
        </q-card-actions>

        <q-card-section class="text-center">
          <a href="#" class="forgot-password">Esqueci minha senha</a><br>
          <p>Ainda não tem uma conta? <br><a href="/register">Faça seu cadastro aqui.</a></p><br>
          <p>Deseja fazer uma conta empresarial? <br><a href="#">Saiba mais.</a></p><br>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { loginUser } from 'src/services/authService'
import { validationHelper } from 'src/helper/validationHelper'
import { ruleRequired, ruleEmail } from 'src/helper/rulesHelper.js'

export default {
  data () {
    const { showValidationError, setValidationErrors, getValidationErrors, hasValidationErrors } = validationHelper()
    return {
      showValidationError,
      setValidationErrors,
      getValidationErrors,
      hasValidationErrors,
      ruleRequired,
      ruleEmail,
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      await loginUser({ email: this.email, password: this.password })
        .then(response => {
          const { email, token } = response

          // Armazenar nome de usuário e token
          sessionStorage.setItem('username', email)
          sessionStorage.setItem('token', token)

          this.setValidationErrors([])
          // Redirecionar para a página principal ou dashboard
          this.$router.push('/')
        }).catch(error => {
          this.setValidationErrors(error.response.data.errors)
          this.showValidationError()
          setTimeout(() => { this.setValidationErrors([]) }, 6000)
        })
    }
  }
}
</script>

<style scoped>

.login-card {
  max-width: 90%;
  width: 500px;
  margin: auto;
  padding: 20px;
  background-color: transparent;
  box-shadow: none;
}

.login-logo {
  height: 110px;
  margin-bottom: 10px;
}

.login-title {
  color: #616161;
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: bold;
}

.login-button {
  background-color: #009949;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 0px;
  width: 40%;
  transition: 0.3s all ease-in-out;
}

.login-button:hover {
  background-color: #02ED88;
}

.no-shadow {
  box-shadow: none;
}

.forgot-password {
  color: #1e88e5;
  text-decoration: none;
  display: block;
  margin-top: 10px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #616161;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
}

.custom-input {
  background-color: #ffffff;
}

.custom-input .q-field__control {
  border-radius: 8px;
}

.login-labels {
 color: #504949;
 font-family: 'Montserrat', sans-serif;
 font-size: 18px;
}

a {
  color: #1e88e5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

p {
  margin: 10px 0;
}

header{
  display: none; /* Isso irá esconder o q-toolbar */
}
</style>
