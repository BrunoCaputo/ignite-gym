import { api } from '@services/api'

export function getExerciseThumb(thumb: string) {
  return `${api.defaults.baseURL}/exercise/thumb/${thumb}`
}

export function getExerciseDemo(demo: string) {
  return `${api.defaults.baseURL}/exercise/demo/${demo}`
}
