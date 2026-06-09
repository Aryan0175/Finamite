import { createContext, useState, useEffect } from 'react';
import { loginUserAPI, registerUserAPI } from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        
        if (token && userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        const data = await loginUserAPI(userData);
        localStorage.setItem('token', data.token);
        const userInfo = { _id: data._id, name: data.name, email: data.email };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const register = async (userData) => {
        const data = await registerUserAPI(userData);
        localStorage.setItem('token', data.token);
        const userInfo = { _id: data._id, name: data.name, email: data.email };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};