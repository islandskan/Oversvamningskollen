import { User } from '@/types';
import { apiRequest } from '@/utils/apiClient';

interface UserResponse {
  message: string;
  user?: User;
  users?: User[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UpdateUser {
  userName?: string;
  mail?: string;
  password?: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await apiRequest<UserResponse>('GET', '/api/users');
  return response.users || [];
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const response = await apiRequest<UserResponse>('GET', `/api/users/${id}`);
    return response.user || null;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createUser(userData: RegisterUser): Promise<User> {
  const response = await apiRequest<UserResponse>('POST', '/api/users', {
    userName: userData.name,
    mail: userData.email,
    password: userData.password,
    role: userData.role_id,
  });

  if (!response.user) {
    throw new Error('Failed to create user');
  }

  return response.user;
}

export async function updateUser(id: number, userData: UpdateUser): Promise<User> {
  const response = await apiRequest<UserResponse>('PATCH', `/api/users/${id}`, userData);

  if (!response.user) {
    throw new Error('Failed to update user');
  }

  return response.user;
}

export async function deleteUser(id: number): Promise<User> {
  const response = await apiRequest<UserResponse>('DELETE', `/api/users/${id}`);

  if (!response.user) {
    throw new Error('Failed to delete user');
  }

  return response.user;
}
