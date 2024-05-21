import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = async (token, role) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role);
      setIsAuth(true);
      if (role === "ADMIN") {
        setIsAdmin(true);
      }
      if (role === "MANAGER") {
        setIsManager(true);
      }
      setUserToken(token);
      setUserRole(role);
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      setIsAuth(false);
      setIsAdmin(false);
      setIsManager(false);
      setUserToken(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error removing data', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        if (token) {
          if (role === "ADMIN") {
            setIsAdmin(true);
          }
          if (role === "MANAGER") {
            setIsManager(true);
          }
          setIsAuth(true);
          setUserToken(token);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isManager, isAdmin, isAuth, userRole, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
