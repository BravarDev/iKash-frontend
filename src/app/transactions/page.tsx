"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";

export default function TransactionsPage() {
    const { currentUser } = useUser();
    const { orders, fetchUserOrders, getOrder } = useOrders();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser?.userId) return;
        setLoading(true);
        fetchUserOrders(currentUser.userId).finally(() => setLoading(false));
    }, [currentUser?.userId]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>

            {loading && <p>Loading orders...</p>}

            {!loading && orders.length === 0 && (
                <div className="bg-gray-800 p-4 rounded">
                    <p>No orders found.</p>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {orders.map(o => (
                    <div key={o.orderId} className="bg-[#0E0E13] border border-[#2A2A2A] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-lg font-semibold">Order {o.orderId}</div>
                                <div className="text-sm text-gray-400">Status: {o.orderStatus}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm">Asset: {o.assetAmount}</div>
                                <div className="text-sm">Fiat: {o.fiatAmount}</div>
                            </div>
                        </div>
                        {o.escrow && (
                            <div className="mt-3 text-sm text-gray-300">
                                Escrow: {o.escrow.escrowId} — {o.escrow.escrowStatus}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
