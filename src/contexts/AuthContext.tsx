import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import { saveStorageAuthToken } from '@storage/storageAuthToken'
import {
  getStorageUser,
  removeStorageUser,
  saveStorageUser,
} from '@storage/storageUser'
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
  const [isLoadingStorageData, setIsLoadingStorageData] =
    useState<boolean>(true)

  async function storeUserAndToken(userData: UserDTO, token: string) {
    try {
      setIsLoadingStorageData(true)

      api.defaults.headers.common.Authorization = `Bearer ${token}`

      await saveStorageUser(userData)
      await saveStorageAuthToken(token)
      setUser(userData)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const {
        data: { user: userData, token },
      } = await api.post('/sessions', { email, password })

      if (userData && token) {
        storeUserAndToken(userData, token)
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageData(true)
      setUser({} as UserDTO)
      await removeStorageUser()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsLoadingStorageData(false)
    }
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
      setIsLoadingStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData: isLoadingStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
