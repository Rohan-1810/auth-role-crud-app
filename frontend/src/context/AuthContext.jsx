import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthStore must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  // States: 'idle', 'loading', 'error'
  const [authStatus, setAuthStatus] = useState('idle');
  const [taskStatus, setTaskStatus] = useState('idle');
  
  const [error, setError] = useState(null);

  // Axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
  });

  // Interceptor to add token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Init auth from local storage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthStatus('loading');
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          setAuthStatus('idle');
        } catch (err) {
          localStorage.removeItem('token');
          setAuthStatus('error');
          setError('Session expired. Please log in again.');
        }
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthStatus('loading');
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setAuthStatus('idle');
      toast.success('Logged in successfully');
      return true;
    } catch (err) {
      setAuthStatus('error');
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setAuthStatus('loading');
    setError(null);
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setAuthStatus('idle');
      toast.success('Account created successfully');
      return true;
    } catch (err) {
      setAuthStatus('error');
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTasks([]);
    toast.success('Logged out successfully');
  };

  const fetchTasks = async () => {
    setTaskStatus('loading');
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      setTaskStatus('idle');
    } catch (err) {
      setTaskStatus('error');
      const message = err.response?.data?.message || 'Failed to load tasks';
      toast.error(message);
    }
  };

  const createTask = async (taskData) => {
    setTaskStatus('loading');
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, data]);
      setTaskStatus('idle');
      toast.success('Task created successfully');
      return true;
    } catch (err) {
      setTaskStatus('error');
      const message = err.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    setTaskStatus('loading');
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setTaskStatus('idle');
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      setTaskStatus('error');
      const message = err.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        authStatus, 
        taskStatus, 
        error, 
        tasks,
        login, 
        signup, 
        logout,
        fetchTasks,
        createTask,
        deleteTask
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
