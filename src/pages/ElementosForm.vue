<template>
  <q-page>
    <q-card class="transparent-card custom-padding">
      <div class="row spacing-top"></div>
      <div class="row items-center justify-between">
        <div class="col">
          <p>Conhecimentos, Habilidades e Atitudes</p>
        </div>
          <q-select id="custom-text-color" class="q-mr-sm q-selecFilterElementsType text-center custom-dropdown-icon-color" rounded standout dense options-dense
            v-model="filterOptTypesProf" option-label="name" option-value="id" :options="optTypes">
          </q-select>
        <q-btn class="btn-defalt" label="ADICIONAR" flat @click="addElementosModal = true" style="font-weight: bold;" />
      </div>
      <div class="row q-mt-md">
        <div class="col">
          <div>Após adicionar suas aptidões, clique na palavra e preencha mais informações.</div>
        </div>
      </div>
      <br>
      <div class="container-competencias q-pa-sm" v-if="profEls.length == 0">
        <p>Não possui aptidões registradas.</p>
      </div>
      <div v-else class="container-competencias">
        <q-list class="row q-gutter-md q-mt-sm custom-q-list container-competencias-lista">
          <q-item clickable class="col-auto custom-q-item" v-for="profs in filteredProfessionaElements" :key="profs.id"
            @click="getElementByIdFromApi(profs.id)">
            <q-item-section>
              {{ profs.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
      <!-- Modal Adicionar Aptidões -->
  <q-dialog v-model="addElementosModal">
    <q-card class="column q-pa-sm modalStyle" style="width: 600px; height: 600px;">
      <q-form class="form-container q-pa-sm" @submit="handleSaveElement">
        <div>
          <q-card-section>
            <span class="float-right btn-modal-closed" v-close-popup>
              <q-icon name="close" class="close-icon" />
            </span>
            <p class="row justify-center items-center">Adicionar Aptidõe(s)</p>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-cardFilterAddElement">
            <label for="type" class="subTitleModalAddElement">Tipo:</label>
            <q-select for="type" class="filter" v-model="filterOptType" use-input option-label="name" option-value="id"
              :options="optTypes"></q-select>
          </q-card-section>

          <q-card-section>
            <label for="elementType" class="subTitleModalAddElement">Selecione suas(s) aptidõe(s):</label>
            <q-select class="filter scrollable-select" for="elementType" v-model="form" use-input multiple use-chips
              :options="filteredOptElementTypes" option-label="name" option-value="id">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado encontrado...
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </div>
          <div class="row reverse col-12 q-gutter-sm btn-group-add-modal">
            <q-btn color="positive" class="btn-defalt" label="Salvar" type="submit" v-close-popup />
            <q-btn color="negative" class="btn-defalt" label="Cancelar" v-close-popup />
          </div>
      </q-form>
    </q-card>
  </q-dialog>
  <!-- Modal Editar Aptidões -->
  <q-dialog v-model="dialogEditElement">
    <q-card class="column q-pa-sm modalStyle" style="width: 600px; height: 600px;">
      <q-form class="form-container q-pa-sm" @submit="handleEditElement">
        <div>
          <q-card-section>
            <span class="float-right btn-modal-closed" v-close-popup>
              <q-icon name="close" class="close-icon" />
            </span>
            <p class="row justify-center items-center">{{ formEdit.name }}</p>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <label for="description" class="subTitleModalAddElement">Descrição:</label>
            <q-input for="description" v-model="formEdit.description" type="textarea" class="q-cardInputModal q-pl-sm"
              :rules="[(val) => (val && val.length > 9) || 'Descrição precisa ter no mínimo 10 caracteres.']"
              :error-message="getValidationErrors('description')" :error="hasValidationErrors('description')" />

            <label for="" class="subTitleModalAddElement">Tipo:</label>
            <q-input class="filter q-cardInputModal q-cardInputModalInpt" v-model="formEdit.type" type="text" disable/>

            <label for="level" class="subTitleModalAddElement">Nível:</label>
            <q-select for="level" class="filter q-cardInputModal q-cardInputModalInpt" v-model="formEdit.levelId" :options="optLevels" emit-value map-options
              option-value="id" option-label="name" />
          </q-card-section>
        </div>
          <div class="row reverse col-12 q-gutter-sm q-pt-md">
            <q-btn class="btn-defalt" color="positive" type="submit">Salvar</q-btn>
            <q-btn class="btn-defalt" color="secondary" v-close-popup>Cancelar</q-btn>
            <q-btn class="btn-defalt" color="negative" @click="handleDeleteElement(formEdit.id)" v-close-popup>Excluir</q-btn>
          </div>
      </q-form>
    </q-card>
  </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { validationHelper } from 'src/helper/validationHelper'
import { getTypes, getElementTypes, postElement, getProfessionalElements, getElementById, putElementById, deleteElementById } from 'src/services/elementService'
import { getAllLevels } from 'src/services/levelService'
import AlertMessage from '../components/AlertMessage.vue'

const { showValidationError, setValidationErrors, getValidationErrors, hasValidationErrors } = validationHelper()
const $q = useQuasar()
const optTypes = ref([])
const optElementTypes = ref([])
const optElementTypesClone = ref([])
const optLevels = ref([])
const profEls = ref([])
const form = ref(null)
const addElementosModal = ref(false)
const filterOptType = ref({ id: 'todos', name: 'Todos' })
const filterOptTypesProf = ref({ id: 'todos', name: 'Todos' })
const dialogEditElement = ref(false)
const formEdit = ref({
  id: '',
  name: '',
  description: '',
  type: '',
  levelId: ''
})

const getLevelsFromApi = async () => {
  await getAllLevels().then(resp => {
    optLevels.value = resp
  }).catch(() => {
    optLevels.value = []
  })
}

const getTypesFromApi = async () => {
  await getTypes().then(resp => {
    optTypes.value = resp
    optTypes.value.push({ id: 'todos', name: 'Todos' })
  }).catch(() => {
    optTypes.value = []
  })
}

const getElementTypesFromApi = async () => {
  await getElementTypes().then(resp => {
    optElementTypes.value = resp
    optElementTypesClone.value = resp
  }).catch(() => {
    optElementTypes.value = []
  })
}

const getProfessionalElementsFromApi = async () => {
  await getProfessionalElements().then(resp => {
    profEls.value = resp
  }).catch(() => {
    profEls.value = []
  })
}

const getElementByIdFromApi = async (id) => {
  await getElementById(id).then(resp => {
    dialogEditElement.value = true
    formEdit.value = {
      id: resp.id,
      name: resp.name,
      description: resp.description,
      type: resp.type,
      levelId: resp.levelId,
      levelName: resp.levelName
    }
  }).catch(() => {
    console.log()
  })
}

const handleSaveElement = async () => {
  try {
    for (const item of form.value) {
      await postElement(item.id)
    }
    $q.notify({
      message: 'Elementos(s) cadastrada(s) com sucesso.',
      icon: 'check',
      color: 'green'
    })
    form.value = []
    getProfessionalElementsFromApi()
  } catch (error) {
    $q.notify({
      message: 'Falha no processo de cadastro de elementos.',
      icon: 'check',
      color: 'green'
    })
  }
}

const handleEditElement = async () => {
  $q.dialog({
    component: AlertMessage,
    componentProps: {
      text: `Tem certeza que deseja salvar as alterações do elemento: ${formEdit.value.name} ?`
    }
  }).onOk(async () => {
    const data = { id: formEdit.value.id, levelId: formEdit.value.levelId, description: formEdit.value.description }
    await putElementById(data).then(async () => {
      $q.notify({
        message: 'Aptidão atualizada com sucesso.',
        color: 'green',
        icon: 'edit'
      })
      dialogEditElement.value = false
      await getProfessionalElementsFromApi()
    }).catch((error) => {
      setValidationErrors(error.response.data.errors)
      showValidationError()
      setTimeout(() => { setValidationErrors([]) }, 6000)
    })
  }).onCancel(() => { })
}

const handleDeleteElement = async () => {
  $q.dialog({
    component: AlertMessage,
    componentProps: {
      text: `Tem certeza que deseja excluir esse elemento: ${formEdit.value.name} ?`
    }
  }).onOk(async () => {
    $q.notify({
      message: 'Aptidão excluida.',
      icon: 'check',
      color: 'green'
    })
    await deleteElementById(formEdit.value.id)
    await getProfessionalElementsFromApi()
  }).onCancel(() => { })
}

const filteredOptElementTypes = computed(() => {
  if (!filterOptType.value || filterOptType.value.name === 'Todos') {
    return optElementTypes.value
  }
  return optElementTypes.value.filter(option => option.baseTypeName === filterOptType.value.name)
})

const filteredProfessionaElements = computed(() => {
  if (!filterOptTypesProf.value || filterOptTypesProf.value.name === 'Todos') {
    return profEls.value
  }
  return profEls.value.filter(option => option.baseTypeName === filterOptTypesProf.value.name)
})

onMounted(() => {
  getTypesFromApi()
  getElementTypesFromApi()
  getProfessionalElementsFromApi()
  getLevelsFromApi()
})
</script>

<style scoped>
.form-container {
  place-content: space-between;
  display: flex;
  flex-direction: column;
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

.modalStyle {
  background-color: #f9f9f9;
  border-radius: 20px;
  border: solid 5px;
  border-color: #EDEDED;
  position: relative;
}

.subTitleModalAddElement {
  font-weight: bold;
}

.q-cardFilterAddElement {
  width: 50%;
}

.q-cardInputModal {
  margin-bottom: 20px;
}

.q-cardInputModalInpt {
  width: 50%;
}

q-separator {
  background-color: #EDEDED;
}

.q-selecFilterElementsType {
  width: 200px;
  font-weight: bold;
  font-size: 16px;
  background-color: #616161;
  color: #EDEDED !important;
  border-radius: 15px;
  padding: 0px;
  margin-right: 30px;
  justify-content: center;
}

.btn-group-add-modal {
  position: relative;
}

.btn-group-add-modal {
  top: 100px;
}
</style>
