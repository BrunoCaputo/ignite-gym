import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import { getStorageUser, saveStorageUser } from '@storage/storageUser'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isLoadingUserStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState<boolean>(true)

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

  async function loadUserData() {
    try {
      const loggedUser = await getStorageUser()

      if (loggedUser) {
        setUser(loggedUser)
      }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoadingUserStorageData }}
    >
      {children}
    </AuthContext.Provider>
  )
}
