export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface STTProvider {
  id: string;
  name: string;
  models: STTModel[];
}

export interface STTModel {
  id: string;
  name: string;
  languages: STTLanguage[];
}

export interface STTLanguage {
  id: string;
  name: string;
  code: string;
}

export interface STTConfiguration {
  provider: string;
  model: string;
  language: string;
}

export interface FormError {
  field: string;
  message: string;
}