import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    uid: string;
    email: string;
    name: string;
    plan?: 'free' | 'pro';
    spacesUsed?: number;
    createdAt?: string;
}

interface UserContextType {
    user: User | null;
    updateUser: (userData: User | null) => void;
    login: (userData: User) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const updateUser = (userData: User | null): void => {
        try {
            setUser(userData);
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }
    };

    const login = (userData: User): void => {
        updateUser(userData);
    };

    const logout = (): void => {
        updateUser(null);
    };

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error syncing user to localStorage:', error);
        }
    }, [user]);

    const value: UserContextType = {
        user,
        updateUser,
        login,
        logout,
        isLoggedIn: !!user
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

// Export the context and User type (if needed elsewhere)
export { UserContext };
export type { User };