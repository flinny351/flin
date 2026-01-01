
import { User } from '../types';

const USER_STORAGE_KEY = 'shopinsta_users';
const SESSION_KEY = 'shopinsta_session';

export const authService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  signup: (user: Omit<User, 'id'>): User => {
    const users = authService.getUsers();
    if (users.find(u => u.email === user.email)) {
      throw new Error('User already exists');
    }
    const newUser: User = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, pass: string): User => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (!user) throw new Error('Invalid credentials');
    
    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
