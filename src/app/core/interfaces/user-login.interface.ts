export interface User {
  username: string;
  extraInfo?: string | number | boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  details?: User | { errorMessage: string };
}
