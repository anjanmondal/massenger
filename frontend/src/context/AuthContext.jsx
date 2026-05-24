import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';

// Configuration
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const backendURL = window.location.hostname === "localhost"
  ? "http://localhost:3001"
  : window.location.origin;

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthContextProveider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Loading state
    const nevigate = useNavigate();
    

    // Use useCallback to prevent unnecessary re-renders
    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        setIsCheckingAuth(true);
        try {
            const response = await axios.get('/api/user/check',{
  headers: { Authorization: `Bearer ${token}` }
});
            if (response.data.success) {
                setAuthUser(response.data.user);
            } else {
                setAuthUser(null);
            }
        } catch (error) {
            console.error("Auth Check Error:", error.response?.data?.message || "Not authenticated");
           setAuthUser(null);
            localStorage.removeItem("user");
        } finally {
            setIsCheckingAuth(false);
        }
    }, []);

    // Check auth once on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const logIn = async (formData) => {
        try {
            const res = await axios.post("/api/user/login", formData);
            const userData = res.data.user;
            localStorage.setItem("user", JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Login failed" 
            };
        }
    };
            

    const register = async (formData) => {
        try {
            const res = await axios.post("/api/user/register", formData);
            const userData = res.data.user;
            localStorage.setItem("user", JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Registration failed" 
            };
        }
    };
           

   const logOut = async () => {
        try {
            await axios.post("/api/user/logout");
            setAuthUser(null);
            localStorage.removeItem("user");
            nevigate("/")
        } catch (error) {
            console.error("Logout error", error);
        }
    };

 

    return (
        <AuthContext.Provider value={{
        checkAuth,
        logIn,
        register,
        logOut,
        authUser,
        isCheckingAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);



