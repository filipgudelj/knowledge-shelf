<script lang="ts" setup>
// const supabase = useSupabaseClient()

// let { data: books, error } = await supabase.from('books').select('*')
// console.log(books)
</script>

<template>
  <CategoryScroller />
  <FilterBooks />
  <SortBooks />
  <BooksList />
</template>
