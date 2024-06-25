<template>
  <q-page padding>
  <!-- Lista de Perfis -->
  <!-- VER PERFIL -->
  <div>
    <!-- Botão de voltar para a página "Busca"-->
      <router-link to="/">
    <a href="" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="#616161" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
        </svg>
        <p class="text-bold" style="margin: 0 0 0 8px; color: #504949">Voltar</p>
    </a>
  </router-link>

    <div class="q-mt-xl q-ml-lg">
      <p class="text-weight-medium">Você está visualizando o perfil de <span class="my-profile-name text-bold">{{myProfile ? myProfile.name : 'carregando...'}}</span></p>
    </div>
    <div class="row q-pl-lg q-mt-xl">
       <div class="row col-md-7 container-my-profile q-pa-sm">
        <div class="col-md-1 q-mt-lg q-pl-sm">
          <q-avatar>
            <img class="img-avatar" src="https://avatar.iran.liara.run/public" alt="Avatar provisório" />
          </q-avatar>
        </div>
        <div class="col container-my-profile-infor">
          <p class="q-my-md"><span class="text-bold">Nome: </span>{{myProfile ? myProfile.name : 'carregando...'}}</p>
          <p class="q-my-md"><span class="text-bold">Ocupação: </span>{{myProfile ? myProfile.areaOfExpertise : 'carregando...'}}</p>
          <p class="q-my-md"><span class="text-bold">Curso: </span>{{myProfile ? myProfile.course : 'carregando...'}}</p>
          <p class="q-my-md"><span class="text-bold">Localização: </span>{{myProfile ? myProfile.location : 'carregando...'}}</p>
          <p class="q-my-md"><span class="text-bold">Portfólio: </span>{{myProfile ? myProfile.portfolio : 'carregando...'}}</p>
        </div>
       </div>
    </div>
    <div class="q-mt-xl">
      <!-- Botões para alternar entre Competências e Aptidões -->
      <div class="q-mt-xl">
    <q-btn
      class="btn-profile q-mt-lg q-ml-lg q-mb-lg"
      :class="{ 'active': activeTab === 'competences' }"
      @click="showCompetences"
    >
      Competências
    </q-btn>
    <q-btn
      class="btn-profile q-mt-lg q-ml-sm q-mb-lg"
      :class="{ 'active': activeTab === 'skills' }"
      @click="showSkills"
    >
      Aptidões
    </q-btn>
  </div>

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
    //
    const myProfile = ref()
    const myProfileId = ''
    const profileDetails = ''
    const profileDetailsElement = ''
    const dialogCompetence = ref(false)
    const dialogElement = ref(false)
    return {
      //
      myProfile,
      myProfileId,
      showProfilesList: false, // Lógica do botão que troca a exibição do Home
      activeTab: 'competences', // Começa com competências como padrão
      profileDetails,
      dialogCompetence,
      profileDetailsElement,
      dialogElement,
      mostrar: ref(true),
      router: null, // Initialize router as null
      route: null // Initialize route as null
    }
  },
  methods: {
    // Busca as informações do Profissional pelo ID
    async getProfileInfor (id) {
      try {
        const res = await api.get('professionals/' + id)
        this.myProfile = res.data
        this.myProfile.avatarUrl = 'https://placedog.net/843/bn?id'
        console.log(this.myProfile)
      } catch (error) {
        console.error(error)
      }
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
    }
  },
  computed: {
    activeTabData () {
      return this.activeTab === 'competences' ? this.myProfile.competences : this.myProfile.skills
    }
  },
  mounted () {
    this.router = this.$router // Get the router instance
    this.route = this.router.currentRoute // Get the current route

    // Now you can access the ID from the route parameters
    const profileId = this.route.params.id
    this.getProfileInfor(profileId)
  }
}
</script>

<style scoped>
.space-top {
  margin-top: 110px;
}

.container-btn-search {
  background-color: #EDEDED;
  padding: 15px 0px;
  border-radius: 15px;
}

.container-prof {
  display: flex;
  background-color: #EDEDED;
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
  background-color: #EDEDED;
  border-radius: 15px;
}
.container-competencias {
  width: 98%;
}
.btn-profile{
  background-color: #CDCED0;
  width: 150px;
  border-radius: 15px 15px 0px 0;
}
.active{
  background-color: #504949;
}

.my-profile-name {
  text-transform: uppercase;
  color: #2ACA3E;
}
</style>
