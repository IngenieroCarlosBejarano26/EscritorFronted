export interface AuthRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
}
