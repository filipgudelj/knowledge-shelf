import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const localePath = useLocalePath()

  const register = async (email: string, password: string) => {
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `http://localhost:3000${localePath('/auth/confirm')}`,
      },
    })

    return response
  }

  const login = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    return response
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return { register, login, logout }
})
