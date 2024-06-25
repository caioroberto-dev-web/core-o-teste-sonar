<template>
  <q-page padding>
    <div class="row q-pl-lg">
      <div class="col-12 space-top">
        <p class="text-bold">
          Realize a busca de um profissional ou uma competência/Aptidão que
          esteja atribuída a este.
        </p>
      </div>
      <div class="col-md-4 col-12 q-mt-lg">
        <label for="">Busca</label>
        <q-input v-model="filterName" :placeholder="placeholderText" @keyup.enter="getSearch(filterName)">
          <template v-slot:append>
            <q-icon class="q-pr-sm" name="search" />
          </template>
        </q-input>
      </div>
     <div class="row col-12 container-btn-search q-mt-md q-ml-xs q-col-gutter-sm">
      <div class="col-auto">
        <q-option-group class="flex btn-search"
        :options="optionsSearch"
        type="radio"
        v-model="selectedCriteria"
        dense
        />
      </div>
      <div class="row col-5 container-btn-select">
        <div class="col-5">
          <q-select class="btn-select q-mr-sm text-center " label="competência" rounded standout dense options-dense v-model="competenceTypes"
          :options="optCompetenceTypes"
          option-label="name"
          option-value="id">
        </q-select>
        </div>
        <div class="col-5">
          <q-select class="btn-select q-mr-sm text-center" label="aptidão" rounded standout dense options-dense
          v-model="elementTypes" option-label="name" option-value="id" :options="optElementTypes">
        </q-select>
        </div>
        <div class="col-2">
          <q-btn @click="getCompetenceAndElementsSearch">Buscar</q-btn>
        </div>
      </div>
     </div>
    </div>
    <!-- Lista de Perfis -->
    <div>
    <div
      v-for="profiles in displayedProfiles"
      :key="profiles.id"
      class="row q-ml-lg q-mt-lg container-prof"
    >
      <div class="row col-md-6 col-12">
        <div class="col-md-1">
          <q-avatar>
            <img class="img-avatar" src="https://avatar.iran.liara.run/public" :alt="profiles.name" />
          </q-avatar>
        </div>
        <div class="col-md-5 container-infor">
          <p class="text-bold">{{ profiles.name }}</p>
          <p>{{ profiles.areaOfExpertise }}</p>
          <p>{{ profiles.location }}</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <q-btn class="btn-visited float-right" @click="viewProfile(profiles.id)">Visitar perfil</q-btn>
      </div>
    </div>
  </div>
  <div v-if="displayedProfiles.length > 0">
    <div class="flex justify-center q-mt-lg">
      <q-pagination
  class="btn-pagination"
  v-model="currentPage"  color="black"
  :max-pages="totalPages"  boundary-numbers  :max="totalPages"  />
    </div>
  </div>
  <div v-if="negative === true">
    <p class="text-bold text-center q-mt-lg">Nenhum resultado encontrado...</p>
  </div>
  </q-page>
</template>

<script>
import { api, baseUrl } from 'src/boot/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCompetenceType } from 'src/services/competenceTypeService'
import { getElementTypes } from 'src/services/elementService'
export default {
  name: 'HomePage',
  data () {
    const negative = false
    const selectedCriteria = ref('name')
    const urlCompleta = baseUrl
    return {
      filterName: ref(''),
      searchResults: ref([]), // Search results
      currentPage: ref(1), // Current page for pagination
      pageSize: 10, // Number of results per page
      totalPages: 0, // Total number of pages (calculated later)
      negative,
      selectedCriteria,
      optionsSearch: [
        { label: 'nome', value: 'name' },
        { label: 'área de atuação', value: 'areaOfExpertise' },
        { label: 'instituição de ensino', value: 'educationInstitute' },
        { label: 'localização', value: 'location' }
      ],
      competenceTypes: ref([]),
      optCompetenceTypes: ref([]),
      elementTypes: ref([]),
      optElementTypes: ref([]),
      urlCompleta
    }
  },
  methods: {
    // Busca Competência e Elementos dos Profissionais
    async getCompetenceAndElementsSearch () {
      // Get selected competence ID (if any)
      const competenceID = this.competenceTypes?.id // Optional chaining to handle undefined

      // Get selected element (if any)
      const element = this.elementTypes?.id // Assuming element selection is stored in selectedElement

      // Construct query parameters based on selections
      const params = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      }

      // Add competence parameter if selected
      if (competenceID) {
        params.competence = competenceID
      }

      // Add element parameter if selected
      if (element) {
        params.elements = element
      }

      // Construct the URL
      const baseUrl = this.urlCompleta + 'professionals'
      const url = new URL(baseUrl)
      for (const key in params) {
        url.searchParams.append(key, params[key])
      }

      try {
        const res = await api.get(url.toString())

        // Assuming total count is available in response (modify as needed)
        this.totalPages = Math.ceil(res.data.totalRecords / this.pageSize)

        this.searchResults = res.data.data // Update search results

        // Retorna resultado não encontrado
        if (this.searchResults.length === 0) {
          this.negative = true
        } else {
          this.negative = false
        }
      } catch (error) {
        console.error('Error fetching search results:', error.message)
      }
    },
    // Busca informações do Profissional
    async getSearch () {
      const baseUrl = this.urlCompleta + 'professionals'
      const params = {
      // Update query parameter based on the single selectedCriteria value
        [this.selectedCriteria]: this.filterName,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      }

      const url = new URL(baseUrl)
      for (const key in params) {
        url.searchParams.append(key, params[key])
      }

      const res = await api.get(url.toString())
      // Assuming total count is available in response (modify as needed)
      this.totalPages = Math.ceil(res.data.totalRecords / this.pageSize)

      this.searchResults = res.data.data // Update search results

      // Retorna resultado não encontrado
      if (this.searchResults.length === 0) {
        this.negative = true
      } else {
        this.negative = false
      }
    },
    viewProfile (id) {
      this.router.push('/perfilProfissional/' + id)
    },
    // Busca os tipos de competencias
    async getCompetenceType () {
      const res = await getAllCompetenceType()
      this.optCompetenceTypes = res
    },
    // Busca os tipos de Aptidões
    async getElementTypes () {
      await getElementTypes().then(res => {
        this.optElementTypes = res
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  computed: {
    displayedProfiles () {
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize, this.searchResults.length)
      return this.searchResults.slice(startIndex, endIndex)
    },
    placeholderText () {
      const criteriaLabel = this.optionsSearch.find(option => option.value === this.selectedCriteria)?.label
      return criteriaLabel ? `Buscar por ${criteriaLabel}` : 'Buscar'
    }
  },
  mounted () {
    this.router = useRouter()
    this.getCompetenceType()
    this.getElementTypes()
  }
}
</script>

<style scoped>
.space-top {
  margin-top: 110px;
}

.container-btn-search {
  background-color: #ededed;
  padding: 15px 0px;
  border-radius: 15px;
}

.container-prof {
  display: flex;
  background-color: #ededed;
  border-radius: 15px;
}

.container-prof div {
  align-content: center;
  padding: 15px;
}

.q-avatar {
  font-size: 150px;
}

.container-infor, .container-my-profile-infor {
  margin-left: 130px;
}

</style>
