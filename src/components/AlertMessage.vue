<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-sm">
      <q-icon name="close" class="float-right"></q-icon>
      <!-- Aqui você pode adicionar o conteúdo do seu diálogo -->
      <q-card-section>
        {{ text }}
      </q-card-section>
      <!-- Exemplo de botões -->
      <q-card-actions align="right">
        <q-btn  class="btn-cancel" label="Cancel" @click="onCancelClick" />
        <q-btn  class="btn-ok" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'

export default {
  name: 'AlertMessage',
  props: {
    text: String // Esta é uma prop personalizada para o nosso componente
  },

  emits: ['ok', 'hide', ...useDialogPluginComponent.emits],

  setup (props, { emit }) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    function onOKClick () {
      onDialogOK()
    }

    function onCancelClick () {
      onDialogCancel()
      emit('hide')
    }

    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick
    }
  }
}
</script>

<style scoped>
 .q-dialog-plugin {
  width: 500px;
  background-color: #f4f4f4;
  border-radius: 15px;
 }
 .btn-cancel {
  background-color: #ed1b24;
 }
 .btn-ok {
  background-color: #009949;
 }
 .q-icon {
  font-size: 24px;
 }
</style>
