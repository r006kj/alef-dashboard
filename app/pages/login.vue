<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const signIn = async () => {
  loading.value = true
  error.value = ''
  const { error: e } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (e) error.value = e.message
  else navigateTo('/')
  loading.value = false
}

</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-center">Alef Dashboard</v-card-title>
          <v-card-text>
            <v-text-field v-model="email" label="Email" type="email" />
            <v-text-field v-model="password" label="Contraseña" type="password" />
            <v-alert v-if="error" type="error" density="compact" class="mb-3">{{ error }}</v-alert>
            <v-btn block color="primary" :loading="loading" @click="signIn">Iniciar sesión</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>