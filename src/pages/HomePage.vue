<template>
  <q-page padding>
    <div v-if="mostrar === true">
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
      <div class="col-12 q-mt-md q-gutter-sm container-btn-search q-ml-xs">
        <q-option-group class="flex btn-search"
        :options="options"
        type="radio"
        v-model="selectedCriteria"
        dense
        />
      </div>
    </div>
    <!-- Lista de Perfis -->
    <div
      v-for="profiles in displayedProfiles"
      :key="profiles.id"
      class="row q-ml-lg q-mt-lg container-prof"
    >
      <div class="row col-md-6 col-12">
        <div class="col-md-1">
          <q-avatar>
            <img class="img-avatar" :src="profiles.avatarUrl" alt="" />
          </q-avatar>
        </div>
        <div class="col-md-5 container-infor">
          <p class="text-bold">{{ profiles.name }}</p>
          <p>{{ profiles.areaOfExpertise }}</p>
          <p>{{ profiles.location }}</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <q-btn class="btn-visited float-right" @click="getProfileInfor(profiles.id)">Visitar perfil</q-btn>
      </div>
    </div>
    <div v-if="searchResults.length > 0">
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
  </div>
  <!-- VER PERFIL -->
  <div v-else>
    <q-btn class="q-ml-lg" @click="ativar">Voltar</q-btn>
    <div class="q-mt-lg q-ml-lg">
      <p class="text-bold">Você está visualizando o perfil de <span class="my-profile-name">{{myProfile ? myProfile.name : 'Carregando...'}}</span></p>
    </div>
    <div class="row q-pl-lg q-mt-lg">
       <div class="row col-md-6 container-my-profile q-pa-sm">
        <div class="col-md-1 q-mt-lg q-pl-sm">
          <q-avatar>
            <img class="img-avatar" :src="myProfile ? myProfile.avatarUrl : 'Carregando...' " alt="" />
          </q-avatar>
        </div>
        <div class="col-md-5 container-my-profile-infor">
          <p><span class="text-bold">Nome:</span>{{myProfile ? myProfile.name : 'Carregando...'}}</p>
          <p><span class="text-bold">Ocupação: </span>{{myProfile ? myProfile.areaOfExpertise : 'Carregando...'}}</p>
          <p><span class="text-bold">Curso: </span>{{myProfile ? myProfile.course : 'Carregando...'}}</p>
          <p><span class="text-bold">Localização: </span>{{myProfile ? myProfile.location : 'Carregando...'}}</p>
          <p><span class="text-bold">Portfólio:</span></p>
        </div>
       </div>
    </div>
    <div>
      <!-- Botões para alternar entre Competências e Aptidões -->
    <q-btn class="btn-profile q-mt-lg q-ml-lg q-mb-lg" @click="showCompetences">Competências</q-btn>
    <q-btn class="btn-profile q-mt-lg q-ml-sm q-mb-lg" @click="showSkills">Aptidões</q-btn>

    <!-- Exibição das Competências ou Aptidões -->
    <div v-if="myProfile && (myProfile.competences.length > 0 || myProfile.skills.length > 0)" class="container-competencias q-ml-lg">
      <q-list class="row q-gutter-md custom-q-list container-competencias-lista">
        <q-item
          clickable
          class="col-auto custom-q-item"
          v-for="myProfiles in activeTabData"
          :key="myProfiles.id"
          @click="openDialog(myProfiles.id)"
        >
          <q-item-section>
            {{ myProfiles.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else-if="myProfile && !myProfile.competences.length && !myProfile.skills.length" class="container-competencias q-pa-sm q-ml-lg">
      <p>Não possui {{ activeTab === 'competences' ? 'competências' : 'aptidões' }} registradas.</p>
    </div>
    <q-dialog v-model="dialogCompetence">
      <q-card class="column q-pa-sm modalStyle" style="width: 600px; height: 600px;">
        <q-form class="form-container q-pa-sm">
          <div>
            <q-card-section>
              <span class="float-right btn-modal-closed" v-close-popup>
                <q-icon name="close" class="close-icon" />
              </span>
              <p class="text-center">{{ profileDetails.name }}</p>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <label for="description" class="subTitleModalAddCompetence">Descrição</label>
              <q-input class="q-pl-sm" for="description" v-model="profileDetails.description" type="textarea"
              disable/>
              <label for="level" class="subTitleModalAddCompetence">Nível</label>
              <q-select class="filter" for="level" v-model="profileDetails.levelId" option-value="name"
              option-label="name" readonly disable/>
            </q-card-section>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- Modal Editar Aptidões -->
    <q-dialog v-model="dialogElement">
    <q-card class="column q-pa-sm modalStyle" style="width: 600px; height: 600px;">
      <q-form class="form-container q-pa-sm">
        <div>
          <q-card-section>
            <span class="float-right btn-modal-closed" v-close-popup>
              <q-icon name="close" class="close-icon" />
            </span>
            <p class="row justify-center items-center">{{ profileDetails.name }}</p>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <label for="description" class="subTitleModalAddElement">Descrição:</label>
            <q-input for="description" v-model="profileDetails.description" type="textarea" class="q-cardInputModal q-pl-sm" disable/>

            <label for="" class="subTitleModalAddElement">Tipo:</label>
            <q-input class="filter q-cardInputModal q-cardInputModalInpt" v-model="profileDetails.type" type="text" disable/>

            <label for="level" class="subTitleModalAddElement">Nível:</label>
            <q-select for="level" class="filter q-cardInputModal q-cardInputModalInpt" v-model="profileDetails.levelName" emit-value map-options
              option-value="id" option-label="name" disable/>
          </q-card-section>
        </div>
      </q-form>
    </q-card>
    </q-dialog>
  </div>
  </div>
  </q-page>
</template>

<script>
import { api } from 'src/boot/axios'
import { ref } from 'vue'
//
import { getCompetenceById } from 'src/services/competenceServices'
import { getElementById } from 'src/services/elementService'
//
export default {
  name: 'HomePage',
  data () {
    const negative = false
    const selectedCriteria = ref('name')
    //
    const myProfile = ref()
    const myProfileId = ''
    const profileDetails = ''
    const profileDetailsElement = ''
    const dialogCompetence = ref(false)
    const dialogElement = ref(false)
    return {
      filterName: ref(''),
      searchResults: ref([]), // Search results
      currentPage: ref(1), // Current page for pagination
      pageSize: 10, // Number of results per page
      totalPages: 0, // Total number of pages (calculated later)
      negative,
      selectedCriteria,
      options: [
        { label: 'nome', value: 'name' },
        { label: 'competência', value: 'competence' },
        { label: 'atitude', value: 'elements' },
        { label: 'localidade', value: 'location' },
        { label: 'área de atuação', value: 'areaOfExpertise' },
        { label: 'instituição de ensino', value: 'educationInstitute' }
      ],
      //
      myProfile,
      myProfileId,
      showProfilesList: false, // Lógica do botão que troca a exibição do Home
      activeTab: 'competences', // Começa com competências como padrão
      profileDetails,
      dialogCompetence,
      profileDetailsElement,
      dialogElement,
      mostrar: ref(true)
    }
  },
  methods: {
    async getSearch () {
      const baseUrl = 'http://3.80.227.196:8080/api/professionals'
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
      /* Insere Fotos nos avatares - Estratégia Temporária
      **OBS*** Remover Quando isso não for mais necessário */
      let n = 1
      for (const i in res.data.data) {
        res.data.data[i].avatarUrl = `https://placedog.net/843/bn?id=${n++}`
      }
      console.log('vem da api:' + res.data.totalRecords)
    },
    // Busca as informações do Profissional pelo ID
    async getProfileInfor (id) {
      try {
        // TROCA PARA FALSE E EXIBI A PÁGINA DE PERFIL
        this.mostrar = false
        const res = await api.get('professionals/' + id)
        this.myProfile = res.data
        this.myProfile.avatarUrl = 'https://placedog.net/843/bn?id'
        console.log(this.myProfile)
      } catch (error) {
        console.error(error)
      }
    },
    // Lógica do botão  - Troca Exibição do Meu Perfil pra a Lista de Profissionais
    toggleProfilesList () {
      this.showProfilesList = !this.showProfilesList
    },
    showCompetences () {
      this.activeTab = 'competences'
    },
    showSkills () {
      this.activeTab = 'skills'
    },
    // Busca uma Competência por id
    async getCompetenceDetails (competenceId) {
      const competence = await getCompetenceById(competenceId)
      this.profileDetails = {
        id: competence.id,
        name: competence.competenceType.name,
        description: competence.description ?? '',
        levelId: competence?.level
      }
      console.log(this.profileDetails)
    },
    // Busca uma Aptidão por id
    async getElementDetails (id) {
      const element = await getElementById(id)
      this.profileDetails = {
        id: element.id,
        name: element.name,
        description: element.description,
        type: element.type,
        levelId: element.levelId,
        levelName: element.levelName
      }
      console.log(this.profileDetails)
    },
    openDialog (profileId) {
      // Verifique se é competência ou aptidão com base no profileId
      if (this.activeTab === 'competences') {
        this.dialogCompetence = true
        // Aqui você pode definir o conteúdo específico para competências
        // com base no profileId (por exemplo, usando getCompetenceDetails(profileId))
        this.getCompetenceDetails(profileId)
      } else {
        this.dialogElement = true
        // Aqui você pode definir o conteúdo específico para aptidões
        // com base no profileId (por exemplo, usando getSkillDetails(profileId))
        this.getElementDetails(profileId)
      }
    },
    // VOLTA PARA TRUE E EXIBI A PÁGINA DE BUSCA NOVAMENTE
    async ativar () {
      this.mostrar = true
    }
  },
  computed: {
    displayedProfiles () {
      const startIndex = (this.currentPage - 1) * this.pageSize
      console.log(startIndex)
      const endIndex = Math.min(startIndex + this.pageSize, this.searchResults.length)
      console.log(endIndex)
      return this.searchResults.slice(startIndex, endIndex)
    },
    placeholderText () {
      const criteriaLabel = this.options.find(option => option.value === this.selectedCriteria)?.label
      return criteriaLabel ? `Buscar por ${criteriaLabel}` : 'Buscar'
    },
    activeTabData () {
      return this.activeTab === 'competences' ? this.myProfile.competences : this.myProfile.skills
    }
  },
  mounted () {}
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

/* VER PERFIL */

.container-my-profile {
  background-color: #ededed;
  border-radius: 15px;
}
.container-competencias {
  width: 98%;
}
.btn-profile {
  background-color: #616161;
}
.my-profile-name {
  text-transform: uppercase;
  color: #02ed88;
}
</style>
