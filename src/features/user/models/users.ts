export interface Users {
    userId: string;
    publicKey: string;
    alias?: string;
    email?: string;
    notificationsEnabled: boolean;
    preferredCurrency?: string;
    pendingAccountInfo: boolean;
    kycStatus: string;
    kycUpdatedAt?: string;
    totalVolume: string;
    createdAt: string;
    currentNonce?: string;
    payment_method?: any[];
    paymentMethods?: any[];
}