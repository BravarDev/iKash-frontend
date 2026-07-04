export interface PaymentMethod {
    paymentId: string;
    userId: string;
    bankName: string;
    accountDetails: string;
    isActive: boolean;
}

export interface PaymentMethodOption {
    paymentId?: string;
    payment_id?: string;
    id?: string | number;
    provider_id?: string;
    bankName?: string;
    payment_provider?: { name?: string; type?: string };
    paymentProvider?: { name?: string; type?: string };
    type?: string;
    account_identifier?: string;
    accountIdentifier?: string;
    accountDetails?: string;
    beneficiaryName?: string;
    beneficiary_name?: string;
}