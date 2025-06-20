<script lang="ts" setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const email = ref('')
const password = ref('')

const registerUser = async () => {
  await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: 'http://localhost:3000/auth/confirm',
    },
  })
}

console.log(user.value)
</script>

<template>
  <div class="register">
    <h1>Register</h1>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="registerUser">Register</button>
  </div>
</template>

<style lang="scss" scoped>
.register {
  @include flex(column, center, center);
}
</style>
