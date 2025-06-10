import * as SecureStore from 'expo-secure-store';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useAuth() {

    const [user, setUser] = useState<{} | null>({});

    useEffect(() => {
        // On mount, check storage
        const checkLogin = async () => {
            const token = await SecureStore.getItemAsync('accessToken');
            if (token) {
                setUser({ token });
            }
        };
        checkLogin();
    }, []);

    // When logging in, also save to storage
    const login = async (token: string) => {
        await SecureStore.setItemAsync('accessToken', token);
        setUser({ token });
    };

    // When logging out, clear storage
    const logout = async () => {
        await SecureStore.deleteItemAsync('accessToken');
        setUser(null);
    };

    return { user, login, logout, isLoggedIn: !!user };
}
