export interface User {
  username: string;
  extraInfo?: string | number | boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  status: 'success' | 'error' | 'pending';
}
