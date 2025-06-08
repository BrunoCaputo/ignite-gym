import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import { createContext, PropsWithChildren, useState } from 'react'

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const {
        data: { user },
      } = await api.post('/sessions', { email, password })

      if (user) {
        setUser(user)
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
