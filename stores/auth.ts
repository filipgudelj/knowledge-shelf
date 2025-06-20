import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()

  const register = async (email: string, password: string) => {
    await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/confirm',
      },
    })
  }

  const login = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return { register, login, logout }
})
