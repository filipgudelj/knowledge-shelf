<script lang="ts" setup>
const { data: tasks } = await useFetch('/api/tasks')

const client = useSupabaseClient()
console.log(client)
</script>

<template>
  <div>
    <article
      v-for="task in tasks"
      :key="task.id"
    >
      {{ task.title }}
    </article>
    <h1>This is Home Page</h1>
    <NuxtLink to="/test">Go to Test page</NuxtLink>
  </div>
</template>
