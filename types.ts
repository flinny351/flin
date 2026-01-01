
export interface Webshop {
  id: string;
  name: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type ViewState = 'landing' | 'dashboard' | 'editor' | 'preview' | 'blueprint';
