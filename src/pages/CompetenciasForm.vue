<template>
  <q-page>
    <q-card class="transparent-card custom-padding">
      <div class="row spacing-top">
      </div>
      <div class="row items-center justify-between">
        <div class="col">
          <p>Competências</p>
        </div>
        <div class="col-auto">
          <q-btn class="btn-defalt" label="ADICIONAR" flat @click="addCompetenciaModal = true"
            style="font-weight: bold;" />
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col">
          <div>Após adicionar uma competência que você já possui, clique na palavra e preencha mais informações.</div>
        </div>
      </div>
      <br>
      <div class="container-competencias q-pa-sm" v-if="prof.length === 0">
        <p>Não possui competências registradas.</p>
      </div>
      <div v-else class="container-competencias">
        <q-list class="row q-gutter-md q-mt-sm custom-q-list container-competencias-lista">
          <q-item clickable class="col-auto custom-q-item" v-for="profs in prof" :key="profs.id"
            @click="(dialogEditCompetence = true), getCompetenceDetails(profs.id)">
            <q-item-section>
              {{ profs.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
    <!--Modal Adicionar Competências-->
    <q-dialog v-model="addCompetenciaModal">
      <q-card class="column q-pa-sm modalStyle" style="width: 600px; height: 600px;">
        <q-form class="form-container q-pa-sm" @submit="handleSubmit">
          <div>
            <q-card-section>
              <span class="float-right btn-modal-closed" v-close-popup>
                <q-icon name="close" class="close-icon" />
              </span>
              <p class="row justify-center items-center">Adicionar competência</p>
            </q-card-section>

            <q-separator class="q-mb-xl" />

            <label for="competenceType" class="subTitleModalAddElement text-bold">Selecione sua(s)
              competência(s):</label>
            <q-select class="scrollable-select" for="competenceType" v-model="form" use-input multiple use-chips
              :options="optCompetenceTypes" option-label="name" option-value="id">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado encontrado...
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div>
            <div class="row reverse col-12 q-gutter-sm">
              <q-btn color="positive" class="btn-defalt" label="Salvar" type="submit" v-close-popup />
              <q-btn color="negative" class="btn-defalt" label="Cancelar" v-close-popup />
            </div>
          </div>
        </q-form>

      </q-card>
    </q-dialog>
    <!--Modal de visualizar os detalhes da competência-->
    <q-dialog v-model="dialogEditCompetence">
      <q-card class="column q-pa-sm modalStyle scroll" style="width: 600px; height: 600px;">
        <q-form class="form-container q-pa-sm" @submit="handleEditCompetence(formEdit.id)">
          <div>
            <q-card-section>
              <span class="float-right btn-modal-closed" v-close-popup>
                <q-icon name="close" class="close-icon" />
              </span>
              <p class="text-center">{{ formEdit.name }}</p>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <label for="description" class="subTitleModalAddCompetence">Descrição</label>
              <q-input class="q-pl-sm" for="description" v-model="formEdit.description" type="textarea"
                :rules="[(val) => (val && val.length > 9) || 'Descrição precisa ter no mínimo 10 caracteres.']"
                :error-message="getValidationErrors('description')" :error="hasValidationErrors('description')" />
              <label for="level" class="subTitleModalAddCompetence">Nível</label>
              <q-select class="filter q-cardInputModalInpt" for="level" v-model="formEdit.levelId" :options="optLevels"
                option-value="name" option-label="name" />
              <p class="text-center q-mt-xl">Aptidões</p>
              <label for="filtroElementsType" class="subTitleModalAddCompetence">Filtrar por Aptidões</label>
              <q-select class="filter q-cardInputModalInpt" for="filtroElementsType" v-model="filterOptType" :options="optTypes" use-input option-label="name" option-value="id"></q-select>
              <label for="" class="subTitleModalAddCompetence">Seleção de Aptidões</label>
              <q-select class="filter scrollable-select" for="elementType" v-model="formVinculo" use-input multiple use-chips
              :options="filteredOptElementTypes" option-label="name" option-value="id"></q-select>
            </q-card-section>
          </div>
          <div class="row reverse col-12 q-gutter-sm q-mb-xs q-pb-sm">
            <q-btn color="positive" type="submit">Salvar</q-btn>
            <q-btn color="secondary" v-close-popup>Cancelar</q-btn>
            <q-btn color="negative" @click="handleDeleteCompetence(formEdit.id)" v-close-popup>Excluir</q-btn>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { getAllCompetenceType } from 'src/services/competenceTypeService'
import { getAllCompetence, postCompetence, getCompetenceById, DeleteCompetenceById, putCompetence } from 'src/services/competenceServices'
import { getAllLevels } from 'src/services/levelService'
import { validationHelper } from 'src/helper/validationHelper'
import AlertMessage from '../components/AlertMessage.vue'
//
import { getProfessionalElements, getTypes } from 'src/services/elementService'
import { api } from 'src/boot/axios'

const addCompetenciaModal = ref(false)
const dialogEditCompetence = ref(false)
const { showValidationError, setValidationErrors, getValidationErrors, hasValidationErrors } = validationHelper()
const $q = useQuasar()
const prof = ref([])
const optCompetenceTypes = ref([])
const optLevels = ref([])
const form = ref([])
const formEdit = ref({
  id: '',
  name: '',
  description: '',
  levelId: ''
})
//
const profElsRegistred = ref([])
const optTypes = ref([])
const filterOptType = ref({ id: 'todos', name: 'Todos' })
const formVinculo = ref([])
onMounted(() => {
  getCompetences()
  getCompetenceType()
  getLevels()
  //
  getProfessionalElementsFromApi()
  getTypesFromApi()
})

// Criar competencias
const handleSubmit = async () => {
  try {
    for (const item of form.value) {
      await postCompetence({ competenceTypeId: item.id, levelId: 1 })
    }
    getCompetences()
    $q.notify({
      message: 'Competência(s) cadastrada(s) com sucesso.',
      icon: 'check',
      color: 'green'
    })
    form.value = []
  } catch (error) {
    $q.notify({
      message: 'Falha no processo de cadastro de competência.',
      icon: 'check',
      color: 'green'
    })
  }
}

// Buscas os levels
const getLevels = async () => {
  const response = await getAllLevels()
  optLevels.value = [...response]
}

// Busca os tipos de competencias
const getCompetenceType = async () => {
  const response = await getAllCompetenceType()
  optCompetenceTypes.value = response
}

// Busca as competencias do usuário
const getCompetences = async () => {
  elementsV()
  const res = await getAllCompetence()
  prof.value = res
}

// Busca uma competencia por id
const getCompetenceDetails = async (competenceId) => {
  const competence = await getCompetenceById(competenceId)
  formEdit.value = {
    id: competence.id,
    name: competence.competenceType.name,
    description: competence.description ?? '',
    levelId: competence?.level
  }
}

// Editar uma competencia
const handleEditCompetence = async (id) => {
  $q.dialog({
    component: AlertMessage,
    componentProps: {
      text: 'Tem certeza que deseja salvar as alterações da competência: ' + formEdit.value.name + '?'
    }
  }).onOk(async () => {
    await putCompetence(formEdit.value.id, {
      description: formEdit.value.description,
      levelId: formEdit.value.levelId.id
    }).then(async () => {
      $q.notify({
        message: `${formEdit.value.name} atualizada com sucesso!`,
        color: 'green',
        icon: 'edit'
      })
      dialogEditCompetence.value = false
      await getCompetences()
    }).catch((error) => {
      setValidationErrors(error.response.data.errors)
      showValidationError()
      setTimeout(() => { setValidationErrors([]) }, 6000)
    })
  }).onCancel(() => { })
}

// Deletar uma competencia
const handleDeleteCompetence = async (id) => {
  $q.dialog({
    component: AlertMessage,
    componentProps: {
      text: `Tem certeza que deseja excluir essa competência: ${formEdit.value.name} ?`
    }
  }).onOk(async () => {
    $q.notify({
      message: 'Competência excluida com sucesso.',
      icon: 'check',
      color: 'green'
    })
    await DeleteCompetenceById(id)
    getCompetences()
  }).onCancel(() => { })
}

// Busca as Aptidões pelo ID
const getProfessionalElementsFromApi = async () => {
  await getProfessionalElements().then(resp => {
    profElsRegistred.value = resp
  }).catch(() => {
    profElsRegistred.value = []
  })
}

// Filtra aptidões
const getTypesFromApi = async () => {
  await getTypes().then(resp => {
    optTypes.value = resp
    optTypes.value.push({ id: 'todos', name: 'Todos' })
  }).catch(() => {
    optTypes.value = []
  })
}

const filteredOptElementTypes = computed(() => {
  if (!filterOptType.value || filterOptType.value.name === 'Todos') {
    console.log(profElsRegistred.value)
    return profElsRegistred.value
  }
  return profElsRegistred.value.filter(option => option.baseTypeName === filterOptType.value.name)
})

const elementsV = async () => {
  const arr = []
  for (const form of formVinculo.value) {
    arr.push(form.id)
    const res = await api.put(`/competences/${arr}`)
    console.log(res)
  }
}
</script>

<style scoped>
.form-container {
  place-content: space-between;
  display: flex;
  flex-direction: column;
  height: 100%;
}

p {
  font-size: 24px;
  font-weight: bold;
}

.row {
  display: flex;
  align-items: center;
}

.q-card {
  max-width: 1400px;
  margin: 0 auto;
}

.q-select {
  background-color: #ededed;
  border-radius: 15px;
}

.modalStyle {
  background-color: #f9f9f9;
  border-radius: 20px;
  border: solid 5px;
  border-color: #EDEDED;
  position: relative;
}

q-separator {
  background-color: #EDEDED;
}

.subTitleModalAddCompetence {
  display: flex;
  margin-top: 30px;
  font-weight: bold;
}

.q-cardInputModalInpt {
  width: 50%;
}
</style>
