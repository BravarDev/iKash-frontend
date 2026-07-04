'use client';

import { useEffect, useState } from "react";
import { Navbar } from "../welcome/components/Navbar";
import { useStats } from "@/features/stats/hooks/useStats";
import { MetricCard } from "./components/MetricCard";
import { ShieldCheck, TrendingUp, UserPlus, Wallet } from "lucide-react";

export default function StatsPage() {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const { stats, getStats } = useStats();

    const handleConnectWallet = () => {
        setIsConnectModalOpen(true);
    };

    useEffect(() => {
        getStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#010308] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#BCED09] selection:text-[#010308]">
            <Navbar onConnectClick={handleConnectWallet} />
            <section className="max-w-325 mx-auto">
                <div className="ml-4">
                    <div className="mt-10">
                        <h1 className="text-[#BCED09] font-bold text-xl mb-2">
                            STATISTICS & ANALYTICS
                        </h1>
                        <p className="text-[#C0CAAD] text-sm">
                            Real-time network performance and node consensus data.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 justify-center items-center mt-10 px-4">
                    <MetricCard
                        icon={<UserPlus size={18} />}
                        badge={
                            <span className="flex items-center gap-1 text-[11px] text-lime-400 font-medium tracking-wide">
                                <TrendingUp size={11} /> 24% BOOST
                            </span>
                        }
                        label="Waitlist Interest"
                        value={<span className="text-[#BCED09]">{stats?.waitlist_member || 0}</span>}
                        unit="Units"
                    />
                    <MetricCard
                        icon={<Wallet size={20} />}
                        badge={
                            <span className="flex items-center justify-center gap-1 text-[10px] text-[#BCED09] font-extrabold uppercase">
                                Testnet Alpha
                            </span>
                        }
                        label="Connected Wallets"
                        value={stats?.wallets_connected || 0}
                        unit="Active"
                    />
                    <MetricCard
                        icon={<ShieldCheck size={20} />}
                        badge={
                            <span className="flex items-center justify-center gap-1 text-[10px] text-[#BCED09] font-extrabold uppercase">
                                99.8% Success
                            </span>
                        }
                        label="Escrows Completed"
                        value={stats?.escrows_completed || 0}
                        unit="Settied"
                    />
                </div>
            </section>
            <div className="flex items-center justify-center mt-10 gap-4">
                <div className="gap-4 justify-center items-center w-204 h-124.5 bg-[#1A1A1A99] border border-[#FFFFFF0D] rounded-lg">
                    <p className="font-semibold text-xl text-[#E3E2E2] ml-8 mt-5">Waitlist growth</p>
                </div>
                <div className="gap-4 justify-center items-center w-100 h-124.5 bg-[#1A1A1A99] border border-[#FFFFFF0D] rounded-lg">
                    <p className="text-[#E3E2E2] font-bold text-[11px] mt-5 ml-8">Live Feed Stats</p>
                    <div className="flex flex-col mt-8 ml-8 gap-12">
                        <div>
                            <p className="text-[14px] text-[#C0CAAD]">Escrows Created</p>
                            <p className="text-[24px] text-[#A0FB00] font-bold">{stats?.escrow_created || 0}</p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#C0CAAD]">Avg. Monthly Completed Escrows</p>
                            <p className="text-[24px] text-[#E3E2E2] font-bold">{stats?.avg_monthly_completed_escrow || 0}</p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#C0CAAD]">Avg. Transactions per User (a month)</p>
                            <p className="text-[24px] text-[#E3E2E2] font-bold">{stats?.avg_transactions_per_user || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}