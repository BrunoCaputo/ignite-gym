import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'
import {
  getStorageAuthToken,
  saveStorageAuthToken,
} from '@storage/storageAuthToken'
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
  isLoadingStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingStorageData, setIsLoadingStorageData] =
    useState<boolean>(true)

  async function updateUserAndToken(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    setUser(userData)
  }

  async function storeUserAndToken(userData: UserDTO, token: string) {
    try {
      await saveStorageUser(userData)
      await saveStorageAuthToken(token)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoadingStorageData(true)

      const {
        data: { user: userData, token },
      } = await api.post('/sessions', { email, password })

      if (userData && token) {
        await storeUserAndToken(userData, token)
        await updateUserAndToken(userData, token)
      }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsLoadingStorageData(false)
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
      setIsLoadingStorageData(true)

      const loggedUser = await getStorageUser()
      const token = await getStorageAuthToken()

      if (token && loggedUser) {
        updateUserAndToken(loggedUser, token)
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
        isLoadingStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
