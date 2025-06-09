import { User, AuthState } from './types';

// Simple password hashing (in production, use bcrypt or similar)
export function hashPassword(password: string): string {
  return btoa(password + 'salt'); // Base64 encoding with salt
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function saveUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const users = await getUsers();
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    password: hashPassword(user.password)
  };
  
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('/users.json');
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  // In a real app, this would be an API call to save to a database
  // For this demo, we'll store in localStorage as we can't write to public files
  localStorage.setItem('users', JSON.stringify(users));
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  
  if (user && verifyPassword(password, user.password)) {
    return user;
  }
  
  return null;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUser = { ...users[userIndex], ...updates };
  if (updates.password) {
    updatedUser.password = hashPassword(updates.password);
  }
  
  users[userIndex] = updatedUser;
  await saveUsers(users);
  return updatedUser;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}