'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Users } from '../../models/users';

interface UserContextType {
    currentUser: Users | null;
    setCurrentUser: (user: Users | null) => void;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Optional: Load user from localStorage or similar if needed
    useEffect(() => {
        const storedUser = localStorage.getItem('ikash_user');
        const storedToken = localStorage.getItem('ikash_token');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
        if (storedToken) {
            setAccessToken(storedToken);
        }
    }, []);

    const handleSetCurrentUser = (user: Users | null) => {
        setCurrentUser(user);
        if (user) {
            localStorage.setItem('ikash_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('ikash_user');
        }
    };

    const handleSetAccessToken = (token: string | null) => {
        setAccessToken(token);
        if (token) {
            localStorage.setItem('ikash_token', token);
        } else {
            localStorage.removeItem('ikash_token');
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setAccessToken(null);
        localStorage.removeItem('ikash_user');
        localStorage.removeItem('ikash_token');
        localStorage.removeItem('ikash_wallet_session');
        window.location.href = "/";
    };

    return (
        <UserContext.Provider value={{ 
            currentUser, 
            setCurrentUser: handleSetCurrentUser, 
            accessToken,
            setAccessToken: handleSetAccessToken,
            isLoading, 
            setIsLoading,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
