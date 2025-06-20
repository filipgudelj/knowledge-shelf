<script lang="ts" setup>
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')

const loginUser = async () => {
  await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="loginUser">Login</button>
  </div>
</template>

<style lang="scss" scoped>
.login {
  @include flex(column, center, center);
}
</style>
