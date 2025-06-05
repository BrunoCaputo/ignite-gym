import { AuthContext, AuthContextDataProps } from '@contexts/AuthContext'
import { useContext } from 'react'

export function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>')
  }

  return context
}
