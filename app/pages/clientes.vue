<script setup lang="ts">
const supabase = useSupabaseClient()
const clientes = ref<any[]>([])
const search = ref('')
const dialog = ref(false)
const form = ref<{ id: string | null; nombre: string; telefono: string; email: string; documento: string }>({
  id: null,
  nombre: '',
  telefono: '',
  email: '',
  documento: '',
})

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Teléfono', key: 'telefono' },
  { title: 'Email', key: 'email' },
  { title: 'Documento', key: 'documento' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const cargar = async () => {
  const { data } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })
  clientes.value = data ?? []
}

const abrirNuevo = () => {
  form.value = { id: null, nombre: '', telefono: '', email: '', documento: '' }
  dialog.value = true
}

const abrirEditar = (c: any) => {
  form.value = { ...c }
  dialog.value = true
}

const user = useSupabaseUser()


const guardar = async () => {
  const { id, ...campos } = form.value
  const query = id
    ? supabase.from('clientes').update(campos).eq('id', id)
    : supabase.from('clientes').insert({ ...campos, user_id: user.value?.id })

  const { error } = await query
  if (error) { alert(error.message); return }
  dialog.value = false
  cargar()
}

const eliminar = async (id: string) => {
  await supabase.from('clientes').delete().eq('id', id)
  cargar()
}

onMounted(cargar)
</script>

<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h2>Clientes</h2>
      <v-spacer />
      <v-btn color="primary" @click="abrirNuevo">Nuevo cliente</v-btn>
    </div>

    <v-text-field v-model="search" label="Buscar por nombre" clearable class="mb-4" />

    <v-data-table :headers="headers" :items="clientes" :search="search">
      <template #item.acciones="{ item }">
        <v-btn icon="mdi-pencil" size="small" variant="text" @click="abrirEditar(item)" />
        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="eliminar(item.id)" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ form.id ? 'Editar' : 'Nuevo' }} cliente</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.nombre" label="Nombre" />
          <v-text-field v-model="form.telefono" label="Teléfono" />
          <v-text-field v-model="form.email" label="Email" />
          <v-text-field v-model="form.documento" label="Documento" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>