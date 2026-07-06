<script setup lang="ts">
const supabase = useSupabaseClient()
const clientes = ref<any[]>([])
const citas = ref<any[]>([])
const error = ref('')
const ok = ref('')
const hoy = new Date().toISOString().slice(0, 10)
const form = ref<{ cliente_id: string | null; fecha: string; hora: string; servicio: string }>({
  cliente_id: null,
  fecha: hoy,
  hora: '',
  servicio: '',
})

const headers = [
  { title: 'Cliente', key: 'clientes.nombre' },
  { title: 'Hora', key: 'hora' },
  { title: 'Servicio', key: 'servicio' },
  { title: 'Estado', key: 'estado' },
]

const cargarClientes = async () => {
  const { data } = await supabase.from('clientes').select('id, nombre').order('nombre')
  clientes.value = data ?? []
}

const cargarCitasHoy = async () => {
  const { data, error: e } = await supabase
    .from('citas')
    .select('id, hora, servicio, estado, clientes(nombre)')
    .eq('fecha', hoy)
    .order('hora')
  if (e) { console.error('Error citas:', e); return }
  citas.value = data ?? []
}

const agendar = async () => {
  error.value = ''
  ok.value = ''
  const { cliente_id, fecha, hora, servicio } = form.value
  if (!cliente_id) { error.value = 'Selecciona un cliente.'; return }
  const { error: e } = await supabase.from('citas').insert({ cliente_id, fecha, hora, servicio })
  if (e) {
    error.value = e.code === '23505'
      ? 'Ese horario ya está ocupado. Elige otra hora.'
      : e.message
    return
  }
  ok.value = 'Cita agendada.'
  form.value.hora = ''
  form.value.servicio = ''
  if (form.value.fecha === hoy) cargarCitasHoy()
}

onMounted(async () => {
  await cargarClientes()
  await cargarCitasHoy()
})
</script>

<template>
  <div>
    <h2 class="mb-4">Citas</h2>

    <v-card class="pa-4 mb-6">
      <div class="text-subtitle-1 mb-2">Agendar cita</div>
      <v-row>
        <v-col cols="12" md="3">
          <v-select v-model="form.cliente_id" :items="clientes" item-title="nombre" item-value="id" label="Cliente" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="form.fecha" type="date" label="Fecha" />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field v-model="form.hora" type="time" label="Hora" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="form.servicio" label="Servicio" />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn color="primary" @click="agendar">Agendar</v-btn>
        </v-col>
      </v-row>
      <v-alert v-if="error" type="error" density="compact" class="mt-2">{{ error }}</v-alert>
      <v-alert v-if="ok" type="success" density="compact" class="mt-2">{{ ok }}</v-alert>
    </v-card>

    <h3 class="mb-2">Citas de hoy</h3>
    <v-data-table :headers="headers" :items="citas" />
  </div>
</template>