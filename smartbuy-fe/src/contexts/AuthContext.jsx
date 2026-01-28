import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedToken = localStorage.getItem('smartbuy_token');
        const storedUser = localStorage.getItem('smartbuy_user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        
        if (response.success) {
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem('smartbuy_token', token);
            localStorage.setItem('smartbuy_user', JSON.stringify(user));
            return { success: true, user };
        }
        
        return { success: false, message: response.message };
    };

    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        
        if (response.success) {
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            localStorage.setItem('smartbuy_token', token);
            localStorage.setItem('smartbuy_user', JSON.stringify(user));
            return { success: true };
        }
        
        return { success: false, message: response.message };
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('smartbuy_token');
        localStorage.removeItem('smartbuy_user');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
