import { UserDTO } from '@dtos/UserDTO'
import { createContext, PropsWithChildren } from 'react'

export interface AuthContextDataProps {
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
