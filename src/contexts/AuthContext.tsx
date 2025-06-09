import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import { saveStorageUser } from '@storage/storageUser'
import { createContext, PropsWithChildren, useState } from 'react'

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const {
        data: { user: dataUser },
      } = await api.post('/sessions', { email, password })

      if (dataUser) {
        setUser(dataUser)
        saveStorageUser(dataUser)
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function signOut() {
    setUser({} as UserDTO)
    saveStorageUser({} as UserDTO)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
