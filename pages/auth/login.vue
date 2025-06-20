<script lang="ts" setup>
// STATE
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="authStore.login(email, password)">Login</button>
  </div>
</template>

<style lang="scss" scoped>
.login {
  @include flex(column, center, center);
  gap: $spacing-5;
  margin-top: $spacing-7;
}
</style>
