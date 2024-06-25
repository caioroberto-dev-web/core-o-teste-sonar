<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      v-if="showSideMenu"
      class="drawer-custom"
    >
      <q-list class="drawer-content">
        <q-item-label header>
          <img src="icons/logo.png" alt="logo" class="logo"/>
          <p class="logotipo text-center">CORE-O</p>
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          class="menu-links"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-btn color="red" label="Sair" class="botao_sair" @click="logout"/>
    </q-drawer>

    <q-page-container content-class="q-pa-md">
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const router = useRouter()

const linksList = [
  {
    title: 'BUSCA',
    caption: '',
    icon: '',
    to: { name: 'Home' }
  },
  {
    title: 'MEU PERFIL',
    caption: '',
    icon: '',
    to: { name: 'perfilDetalhes' }
  },
  {
    title: 'COMPETÊNCIAS',
    caption: '',
    icon: '',
    to: { name: 'competenciasForm' }
  },
  {
    title: 'APTIDÕES',
    caption: '',
    icon: '',
    to: { name: 'elementosForm' }
  }
]

const leftDrawerOpen = ref(false)
const showSideMenu = ref(true)

function logout () {
  sessionStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.logo {
  height: 80px; /* Aumente o valor conforme necessário */
  display: block;
  margin: 15px auto;
}

.q-drawer {
  background-color: #d8e9f5;
  position: relative;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2); /* Adiciona sombra com desfoque */
}

.q-drawer--bordered {
  border-right: none; /* Remove a borda existente */
}

.q-btn {
  color: #fff;
}

img {
  height: 50px;
  display: block;
  margin: 30px auto;
}

.menu-links {
  font-size: 18px;
  font-weight: bold;
  color: #009949;
  text-align: left;
}

.q-item.q-router-link--active {
  background-color: #cdced0;
}

.drawer-custom {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.drawer-content {
  flex-grow: 1;
}

.botao_sair {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding-left: 25px;
  padding-right: 25px;
  font-weight: bold;
}

.q-page-container {
  padding-left: 185px; /* Alinhando com a largura do q-drawer */
}
</style>
