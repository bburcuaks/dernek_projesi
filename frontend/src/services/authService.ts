import axios from 'axios';

const AUTH_URL = 'http://localhost:8080/api/auth';

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${AUTH_URL}/login`, {
      username,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  },
};
