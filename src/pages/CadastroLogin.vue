<template>
  <q-page class="flex flex-center login-page">
    <q-card class="login-card">
      <q-form @submit="register">
        <q-card-section class="text-center">
          <img src="../assets/logo.png" alt="Logo" class="login-logo" />
          <div class="text-h6 login-title">CORE-O</div>
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
                val => ruleEmail(val) || 'Informe um e-mail válido.'
              ]"
              :error-message="getValidationErrors('email')"
              :error="hasValidationErrors('email')"
              />
          </div>
          <div class="input-group">
            <label for="password">Senha:</label>
            <q-input for="password"
              v-model="password"
              type="password"
              class="custom-input"
              lazy-rules
              :rules="[
                val => ruleMinLength(val, 6) || 'A senha deve ter pelo menos 6 caracteres.'
              ]"
              :error-message="getValidationErrors('password')"
              :error="hasValidationErrors('password')"
            />
          </div>
          <div class="input-group">
            <label for="confirmPassword">Confirmar senha:</label>
            <q-input for="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="custom-input"
              lazy-rules
              :rules="[(val) => (val && val == password) || 'As senhas não coincidem.']"
              :error-message="getValidationErrors('confirmPassword')"
              :error="hasValidationErrors('confirmPassword')"
            />
          </div>
        </q-card-section>
        <q-card-actions class="no-shadow" align="center">
          <q-btn class="login-button" label="CADASTRAR" type="submit" />
        </q-card-actions>
         <br>
        <q-card-section class="text-center">
          <div>
            <p class="no-margin">Você já tem uma conta?</p>
            <a href="/login">Clique aqui para entrar.</a>
          </div>
          <br>
          <div>
            <p>Deseja fazer uma conta empresarial? <br><a href="#">Saiba mais.</a></p><br>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { registerUser } from 'src/services/authService'
import { validationHelper } from 'src/helper/validationHelper'
import { ruleRequired, ruleEmail, ruleMinLength } from 'src/helper/rulesHelper.js'

export default {
  data () {
    const { showValidationError, setValidationErrors, getValidationErrors, hasValidationErrors } = validationHelper()
    return {
      showValidationError,
      setValidationErrors,
      getValidationErrors,
      hasValidationErrors,
      ruleEmail,
      ruleRequired,
      ruleMinLength,
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    validateEmail (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
    async register () {
      await registerUser({ email: this.email, password: this.password, confirmPassword: this.confirmPassword })
        .then(response => {
          this.setValidationErrors([])
          this.$router.push('/perfil')
          this.email = ''
          this.password = ''
          this.confirmPassword = ''
        }).catch(error => {
          this.setValidationErrors(error.response.data.errors)
          this.showValidationError()
          setTimeout(() => { this.setValidationErrors([]) }, 6000)
        })
    }
  }
}
</script>

<style>

.login-card {
  max-width: 90%;
  width: 500px;
  margin: auto;
  padding: 20px;
  background-color: transparent;
  box-shadow: none;
}

.login-logo {
  height: 100px;
  margin-bottom: 20px;
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
}

.no-shadow {
  box-shadow: none !important;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #504949;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
}

.custom-input {
  background-color: #ffffff !important;
}

.custom-input .q-field__control {
  border-radius: 8px !important;
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
  display: none;
}

@media (max-width: 576px) {
  .q-btn {
    border-radius: 10px;
    width: 100%;
  }
}
</style>
