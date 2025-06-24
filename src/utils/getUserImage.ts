import { api } from '@services/api'

export function getUserImage(imageUri: string) {
  return `${api.defaults.baseURL}/avatar/${imageUri}`
}
