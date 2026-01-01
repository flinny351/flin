
export interface Webshop {
  id: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  status: 'online' | 'offline';
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export type ViewState = 'landing' | 'login' | 'signup' | 'dashboard' | 'editor' | 'preview' | 'blueprint' | 'live';
