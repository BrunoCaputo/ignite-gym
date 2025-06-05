import { UserDTO } from '@dtos/UserDTO'
import { createContext, PropsWithChildren, useContext } from 'react'

export type AuthContextDataProps = {
  user: UserDTO
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const value: AuthContextDataProps = {
    user: {
      id: '1',
      name: 'Bruno Caputo',
      email: 'bruno@email.com',
      avatar: 'BrunoCaputo.png',
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>')
  }

  return context
}
