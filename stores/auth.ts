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

  const sendPasswordResetLink = async (email: string) => {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000${localePath('/auth/reset-password')}`,
    })

    return response
  }

  const updateUserPassword = async (newPassword: string) => {
    const response = await supabase.auth.updateUser({ password: newPassword })

    return response
  }

  return { register, login, logout, sendPasswordResetLink, updateUserPassword }
})
