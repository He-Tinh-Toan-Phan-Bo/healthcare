import { apiClient } from '@/shared/lib/apiClient'
import type { User } from '@/shared/types'

export type AuthResponse = {
  accessToken: string
  user: User
}

export async function postRegister(input: {
  name: string
  email: string
  phone?: string
  password: string
}): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/v1/auth/register', input)
  return res.data
}

export async function postLogin(input: { email: string; password: string }): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/v1/auth/login', input)
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>('/v1/users/me')
  return res.data
}

