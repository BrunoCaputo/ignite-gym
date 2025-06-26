import AsyncStorage from '@react-native-async-storage/async-storage'

import { AUTH_TOKEN_STORAGE } from './storageConfig'

interface StorageAuthTokenProps {
  token: string
  refreshToken: string
}

export async function saveStorageAuthToken({
  token,
  refreshToken,
}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ token, refreshToken }),
  )
}

export async function getStorageAuthToken(): Promise<StorageAuthTokenProps> {
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)

  const { token, refreshToken }: StorageAuthTokenProps = response
    ? JSON.parse(response)
    : {}

  return { token, refreshToken }
}

export async function removeStorageAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
