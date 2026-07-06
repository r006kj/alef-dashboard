<script setup lang="ts">
const supabase = useSupabaseClient()
const totalClientes = ref(0)
const citasHoy = ref(0)
const ventasMes = ref(0)
const labels = ref<string[]>([])
const valores = ref<number[]>([])
const hoy = new Date().toISOString().slice(0, 10)

const cargar = async () => {
  const { count: cc } = await supabase.from('clientes').select('*', { count: 'exact', head: true })
  totalClientes.value = cc ?? 0

  const { count: ch } = await supabase.from('citas').select('*', { count: 'exact', head: true }).eq('fecha', hoy)
  citasHoy.value = ch ?? 0

  const inicioMes = hoy.slice(0, 8) + '01'
  const { data: cot } = await supabase.from('cotizaciones').select('total').gte('fecha', inicioMes)
  ventasMes.value = (cot ?? []).reduce((s: number, c: any) => s + Number(c.total), 0)

  const { data: citas } = await supabase.from('citas').select('fecha')
  const conteo: Record<string, number> = {}
  ;(citas ?? []).forEach((c: any) => { conteo[c.fecha] = (conteo[c.fecha] ?? 0) + 1 })
  const dias = Object.keys(conteo).sort().slice(-7)
  labels.value = dias
  valores.value = dias.map(d => conteo[d])
}

onMounted(cargar)
</script>

<template>
  <div>
    <h2 class="mb-4">Dashboard</h2>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption">Total clientes</div>
          <div class="text-h4">{{ totalClientes }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption">Citas de hoy</div>
          <div class="text-h4">{{ citasHoy }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="text-caption">Ventas del mes</div>
          <div class="text-h4">S/ {{ ventasMes.toFixed(2) }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="pa-4 mt-6">
      <div class="text-subtitle-1 mb-2">Citas por día</div>
      <v-sparkline v-if="valores.length" :model-value="valores" :labels="labels" line-width="2" label-size="4" show-labels type="bar" auto-draw />
      <div v-else class="text-caption">Sin datos aún.</div>
    </v-card>
  </div>
</template>