import React, { createContext, useState, useContext, useEffect } from 'react';

interface User { id: string; name: string; email: string; }
interface AuthContextData { signed: boolean; user: User | null; login(token: string, user: User): void; logout(): void; }

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@Financy:user');
    const storagedToken = localStorage.getItem('@Financy:token');
    if (storagedUser && storagedToken) setUser(JSON.parse(storagedUser));
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('@Financy:token', token);
    localStorage.setItem('@Financy:user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);