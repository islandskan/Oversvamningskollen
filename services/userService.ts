import { api } from './api';
import { User } from '@/types';

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


export const userService = {

  async getUsers(): Promise<User[]> {
    const response = await api.get<UserResponse>('/api/users');
    return response.users || [];
  },


  async getUserById(id: number): Promise<User | null> {
    try {
      const response = await api.get<UserResponse>(`/api/users/${id}`);
      return response.user || null;
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError' && (error as any).status === 404) {
        return null;
      }
      throw error;
    }
  },


  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      console.log('Attempting login with credentials:', { email: credentials.email });

      console.log('Fetching all users for authentication');
      const users = await this.getUsers();

      console.log(`Found ${users.length} users, checking for matching credentials`);
      const user = users.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        console.log('Found matching user:', { id: user.id, email: user.email });
      } else {
        console.log('No matching user found for the provided credentials');
      }

      return user || null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },


  async createUser(userData: RegisterUser): Promise<User> {
    const response = await api.post<UserResponse>('/api/users', {
      userName: userData.name,
      mail: userData.email,
      password: userData.password,
      role: userData.role_id,
    });

    if (!response.user) {
      throw new Error('Failed to create user');
    }

    return response.user;
  },


  async updateUser(id: number, userData: UpdateUser): Promise<User> {
    const response = await api.patch<UserResponse>(`/api/users/${id}`, userData);

    if (!response.user) {
      throw new Error('Failed to update user');
    }

    return response.user;
  },


  async deleteUser(id: number): Promise<User> {
    const response = await api.delete<UserResponse>(`/api/users/${id}`);

    if (!response.user) {
      throw new Error('Failed to delete user');
    }

    return response.user;
  },
};
