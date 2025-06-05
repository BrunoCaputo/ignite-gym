import { UserDTO } from '@dtos/UserDTO'
import { createContext, PropsWithChildren, useState } from 'react'

export interface AuthContextDataProps {
  user: UserDTO
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user] = useState<UserDTO>({
    id: '1',
    name: 'Bruno Caputo',
    email: 'bruno@email.com',
    avatar: 'BrunoCaputo.png',
  })

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
