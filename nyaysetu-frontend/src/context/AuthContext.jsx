import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const name = localStorage.getItem('name');

    if (token) {
      setUser({ token, role, phoneNumber, name });
    }
    setLoading(false);
  }, []);

  const login = (token, role, phoneNumber, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('name', name);
    setUser({ token, role, phoneNumber, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
