<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const user = useSupabaseUser()
watch(user, () => {
  if (user.value) navigateTo('/')
}, { immediate: true })
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="auto"><v-progress-circular indeterminate /></v-col>
    </v-row>
  </v-container>
</template>