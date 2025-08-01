import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user || null
  const isLoading = status === "loading"

  return {
    user,
    isLoading,
    login: signIn,
    logout: signOut,
  }
}
