<script setup lang="ts">
const supabase = useSupabaseClient()
const signOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>Alef Dashboard</v-app-bar-title>
      <v-btn to="/" variant="text">Dashboard</v-btn>
      <v-btn to="/clientes" variant="text">Clientes</v-btn>
      <v-btn to="/citas" variant="text">Citas</v-btn>
      <v-spacer />
      <v-btn variant="text" @click="signOut">Salir</v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>