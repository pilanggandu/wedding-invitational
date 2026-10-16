export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  role: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
  token: string;
}
