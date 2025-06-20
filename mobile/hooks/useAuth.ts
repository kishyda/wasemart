import BackendUrl from '@/constants/BackendUrl';
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

export default async function checkLogin(): Promise<boolean> {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    let request = await fetch(`${BackendUrl}/auth/verify?platform=mobile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accessToken,
        }),
    });
    if (request.ok) {
        return true;
    }
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    request = await fetch(`${BackendUrl}/auth/refresh?platform=mobile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreshToken,
        }),
    })
    if (request.ok) {
        const response = await request.json();
        await SecureStore.setItemAsync('accessToken', response.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.refreshToken);
        return true;
    }
    return false;
    
}
