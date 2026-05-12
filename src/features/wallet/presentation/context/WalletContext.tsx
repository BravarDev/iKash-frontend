"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { walletService } from "../../application/wallet.service";
import type { WalletContext, WalletState, WalletProvider } from "../../domain/wallet.types";
import { useRouter } from "next/navigation";
import { useUsers } from "../../../user/hooks/useUsers";
import { useUser } from "../../../user/presentation/context/UserContext";

const Context = createContext<WalletContext | null>(null);

const initialState: WalletState = {
    publicKey: null,
    provider: null,
    isConnected: false,
    isLoading: false,
    error: null,
};

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>(initialState);

    // Restaura sesión al montar
    useEffect(() => {
        walletService.restoreSession().then((session) => {
            if (session) {
                setState((s) => ({
                    ...s,
                    publicKey: session.publicKey,
                    provider: session.provider,
                    isConnected: true,
                }));
            }
        });
    }, []);

    const router = useRouter();
    const { getOrCreateByWallet } = useUsers();
    const { setCurrentUser, setAccessToken } = useUser();

    const connect = useCallback(async (provider: WalletProvider) => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        try {
            const publicKey = await walletService.connect(provider);
            setState({ publicKey, provider, isConnected: true, isLoading: false, error: null });
            
            // Auth logic: Get temporary JWT
            const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicKey }),
            });
            if (loginRes.ok) {
                const { access_token } = await loginRes.json();
                setAccessToken(access_token);
            }

            // Onboarding logic
            const userAccount = await getOrCreateByWallet(publicKey);
            if (userAccount) {
                setCurrentUser(userAccount);
                setCurrentUser(userAccount);
                if (userAccount.pendingAccountInfo) {
                    router.push("/setupAccount");
                } else {
                    router.push("/dashboard");
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            setState((s) => ({ ...s, isLoading: false, error: msg }));
        }
    }, [getOrCreateByWallet, setCurrentUser, router]);

    const disconnect = useCallback(() => {
        walletService.clearSession();
        setState(initialState);
    }, []);

    return (
        <Context.Provider value={{ ...state, connect, disconnect }}>
            {children}
        </Context.Provider>
    );
}

export function useWalletContext(): WalletContext {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useWalletContext debe usarse dentro de WalletProvider");
    return ctx;
}