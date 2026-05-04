'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Users } from '../../models/users';

interface UserContextType {
    currentUser: Users | null;
    setCurrentUser: (user: Users | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Optional: Load user from localStorage or similar if needed
    useEffect(() => {
        const stored = localStorage.getItem('ikash_user');
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
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

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, isLoading, setIsLoading }}>
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
