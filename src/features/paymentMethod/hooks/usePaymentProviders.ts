import { useState, useEffect } from 'react';

export interface PaymentProvider {
    provider_id: string;
    name: string;
    type: 'MOBILE' | 'PLATFORM' | 'BANK';
    country_code: string | null;
    metadata: {
        ui_requirements: Array<{
            db_field: string;
            label: string;
            type: string;
            placeholder?: string;
            required: boolean;
        }>;
    };
}

export function usePaymentProviders() {
    const [providers, setProviders] = useState<PaymentProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-providers`); // I need to create this endpoint too
                if (!response.ok) throw new Error('Failed to fetch providers');
                const data = await response.json();
                setProviders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    return { providers, loading, error };
}
