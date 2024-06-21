<template>
  <q-page class="form-perfil-detalhes-container">
    <div class="row spacing-top"></div>
    <div v-if="perfil == null">
      <h6 class="no-margin q-pb-lg text-center">Carregando</h6>
    </div>
    <div v-else>
      <h6 class="no-margin q-pb-lg">Cadastrar informações</h6>
      <q-form class="row q-col-gutter-md" @submit="onSubmit">
        <div class="col-md-6 col-xl-6 col-12">
          <label for='name'>Nome</label>
          <q-input for="name" v-model="perfil.name" bottom-slots lazy-rules :rules="[val => ruleRequired(val) || 'Campo obrigatório.',
          val => ruleMinLength(val, 3) || 'Mínimo de 3 caracteres.'
          ]" :error-message="getValidationErrors('name')" :error="hasValidationErrors('name')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="lastname">Sobrenome</label>
          <q-input for="lastname" v-model="perfil.lastName" lazy-rules :rules="[val => ruleRequired(val) || 'Campo obrigatório.',
          val => ruleMinLength(val, 3) || 'Mínimo de 3 caracteres.'
          ]" :error-message="getValidationErrors('lastname')" :error="hasValidationErrors('lastname')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="birthDate">Data de Nascimento</label>
          <q-input for="birthDate" v-model="perfil.birthDate" type="date" lazy-rules
            :rules="[val => ruleRequired(val) || 'Campo obrigatório.']"
            :error-message="getValidationErrors('birthDate')" :error="hasValidationErrors('birthDate')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="gender">Gênero</label>
          <q-select for="gender" v-model="perfil.genderId" class="filter" options-dense options-dark emit-value
            map-options use-input hide-dropdown-icon input-debounce="0" :options="optGenres"
            option-label="description" option-value="id" lazy-rules
            :rules="[val => ruleRequired(val) || 'Campo obrigatório.']" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="local">Localização</label>
          <q-input for="local" v-model="perfil.local" lazy-rules
            :rules="[val => ruleMaxLength(val, 50) || 'Máximo de 50 caracteres.']"
            :error-message="getValidationErrors('local')" :error="hasValidationErrors('local')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="educationInstitute">Instituição de ensino</label>
          <q-input for="educationInstitute" v-model="perfil.educationInstitute" lazy-rules
            :rules="[val => ruleMaxLength(val, 100) || 'Máximo de 100 caracteres.']"
            :error-message="getValidationErrors('educationInstitute')"
            :error="hasValidationErrors('educationInstitute')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="courseType">Tipo de Formação</label>
          <q-input for="courseType" v-model="perfil.courseType" lazy-rules
            :rules="[val => ruleMaxLength(val, 100) || 'Máximo de 100 caracteres.']" />
          <q-radio v-model="perfil.courseDone" label="Concluido" :val="true" />
          <q-radio v-model="perfil.courseDone" label="Em andamento" :val="false" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="course">Curso</label>
          <q-input for="course" v-model="perfil.course" lazy-rules
            :rules="[val => ruleMaxLength(val, 100) || 'Máximo de 100 caracteres.']"
            :error-message="getValidationErrors('course')" :error="hasValidationErrors('course')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="job">Cargo</label>
          <q-input for="job" v-model="perfil.job" lazy-rules
            :rules="[val => ruleMaxLength(val, 100) || 'Máximo de 100 caracteres.']"
            :error-message="getValidationErrors('job')" :error="hasValidationErrors('job')" />
        </div>
        <div class="col-md-6 col-xl-6 col-12">
          <label for="weblink">Midia</label>
          <q-input for="weblink" v-model="perfil.webLink" lazy-rules
            :rules="[val => ruleMaxLength(val, 100) || 'Máximo de 100 caracteres.']"
            :error-message="getValidationErrors('webLink')" :error="hasValidationErrors('webLink')" />
        </div>
        <div class="col-md-12 col-xs-12 col-12 q-gutter-sm q-mb-sm">
          <q-btn class="float-right" type="submit" color="primary">Salvar</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { validationHelper } from 'src/helper/validationHelper'
import { getProfessionalByUser, putProfessionalByUser } from 'src/services/professionalService'
import { getAllGenres } from 'src/services/genderService'
import { ruleRequired, ruleMinLength, ruleMaxLength } from 'src/helper/rulesHelper.js'

const { showValidationError, setValidationErrors, getValidationErrors, hasValidationErrors } = validationHelper()
const perfil = ref()
const optGenres = ref([])
const $q = useQuasar()
onMounted(async () => {
  getGenres()
  getPerfil()
})
const getPerfil = async () => {
  try {
    const response = await getProfessionalByUser()
    perfil.value = response
  } catch (error) {
    console.error(error)
  }
}

const getGenres = async () => {
  try {
    const data = await getAllGenres()
    optGenres.value = data
  } catch (error) {
    console.error(error)
  }
}

const onSubmit = async () => {
  await putProfessionalByUser(perfil.value)
    .then(response => {
      setValidationErrors([])
      perfil.value = response
      $q.notify({
        message: 'Perfil atualizado com sucesso.',
        color: 'green',
        icon: 'edit'
      })
    }).catch(({ response }) => {
      setValidationErrors(response.data.errors)
      showValidationError()
    })
}
</script>

<style scoped>
.filter {
  background-color: #ededed;
  border-radius: 15px;
}

.form-perfil-detalhes-container {
  width: 60%;
  margin: 0 auto;
}

label {
  font-size: 24px;
}

@media (max-width: 576px) {
  .form-perfil-detalhes-container {
    width: 100%;
  }

  .q-btn {
    top: 15px;
    width: 100%;
    float: none;
  }
}

@media (min-width: 400px) {
  .form-perfil-detalhes-container {
    width: 80%;
  }

  .q-btn {
    top: 15px;
    margin-bottom: 20px;
  }
}
</style>
