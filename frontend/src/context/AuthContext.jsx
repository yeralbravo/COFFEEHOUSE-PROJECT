import React, { useEffect, createContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';
const USER_API_URL = 'http://localhost:5000/api/user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data.data);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const userResponse = await axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(userResponse.data.data);
        } catch (error) {
            console.error("Error al refrescar el usuario:", error);
            logout();
        }
    }
  }, [logout]);

  const login = useCallback(async (correo, contraseña) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { correo, contraseña });
      const token = res.data.data.token;
      localStorage.setItem('token', token);
      
      const userResponse = await axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
      const userData = userResponse.data.data;
      setUser(userData);

      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'supplier') navigate('/home');
      else navigate('/home');

    } catch (error) {
      const msg = error.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(msg);
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    try {
        const dataToSend = { ...userData, role: userData.role || 'client' };
        const response = await axios.post(`${API_URL}/register`, dataToSend);
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.error || 'Error al registrar el usuario';
        throw new Error(msg);
    }
  }, []);

  const editUser = useCallback(async (id, formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${USER_API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user && user.id === id) {
        await refreshUser();
      }
      return res.data.message;
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al actualizar el usuario';
      throw new Error(msg);
    }
  }, [user, refreshUser]);

  const deleteUser = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${USER_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.message;
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al eliminar el usuario';
      throw new Error(msg);
    }
  }, []);

  const createUserByAdmin = useCallback(async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${USER_API_URL}/admin/create-user`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al crear el usuario';
      throw new Error(msg);
    }
  }, []);
  
  const contextValue = React.useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    editUser,
    deleteUser,
    createUserByAdmin,
    refreshUser
  }), [user, loading, login, register, logout, editUser, deleteUser, createUserByAdmin, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;