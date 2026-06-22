"use client";

import { useEffect, useState } from "react";
import { CreateOfferModal } from "./CreateOfferModal";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import { useOffers } from "@/features/offer/hooks/useOffers";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { KycBanner } from "@/app/components/KycBanner";
import { useWalletBalance } from "@/features/wallet/presentation/hooks/useWalletBalance";
import { Offer } from "@/features/offer/models/offer";

function MerchantBalance({ publicKey, assetCode }: { publicKey?: string; assetCode?: string }) {
    const { balance, balances, isLoading } = useWalletBalance(publicKey || null);

    if (isLoading) return <span className="animate-pulse">...</span>;
    if (!publicKey) return <span>0.00</span>;

    const normalizedAssetCode = assetCode === "XLM" || assetCode === "native" ? "native" : assetCode;

    if (normalizedAssetCode === "native") {
        return <span>{balance || "0.00"}</span>;
    }

    const asset = balances.find(b => b.asset_code === normalizedAssetCode);
    if (!asset) return <span>0.00</span>;

    return <span>{parseFloat(asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

export function TradeDashboard() {
    const [tab, setTab] = useState("Buy");
    const [amount, setAmount] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    // If user wants to "Buy", they need to see offers where the merchant is "selling".
    // If user wants to "Sell", they need to see offers where the merchant is "buying".
    const { offers, isLoading } = useOffers({ type: tab === "Buy" ? "sell" : "buy" });
    // Filter out offers that have been executed/archived server-side
    const visibleOffers = offers.filter(o => !o.executed);

    const { getUser, userFound } = useUsers();
    const { currentUser } = useUser();

    const isVerified = currentUser?.kycStatus === "approved";

    useEffect(() => {
        offers.forEach((offer) => {
            if (offer?.creatorId) {
                getUser(offer.creatorId);
            }
        });
    }, [offers]);

    return (
        <div className="w-full flex flex-col pt-8 pb-12 px-1">
            <KycBanner />

            <div className="w-full mb-8 px-2">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex bg-[#1a1a1a] rounded-xl p-1 w-full md:w-auto">
                        {["Buy", "Sell"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-base font-bold transition-all duration-200
                                ${tab === t
                                    ? "bg-[#343434] text-[#BCED09]"
                                    : "text-[#6b7280] hover:text-white"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (!isVerified) {
                                alert("KYC verification required to create offers.");
                                return;
                            }
                            setIsOpen(true);
                        }}
                        disabled={!isVerified}
                        title={!isVerified ? "KYC verification required" : ""}
                        className={`flex items-center justify-center gap-2 text-base font-bold px-6 py-3 rounded-2xl transition-all duration-200 w-full md:w-auto ${isVerified ? "bg-[#BCED09] text-black hover:bg-[#d4f53a]" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span className="text-lg leading-none">+</span>
                        Create Offer
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full px-2">
                <div className="space-y-4">
                    {visibleOffers.length > 0 ? (
                        visibleOffers.map((offer) => {
                            const paymentMethods = [
                                ...(offer.payment_methods || []),
                                ...(offer.paymentMethods || [])
                            ];
                            
                            return (
                                <div
                                    key={offer.offerId}
                                    className="flex flex-col xl:flex-row bg-[#161618] border border-[#1F2937] rounded-2xl p-6 hover:border-[#BCED09] hover:bg-[#1A1A1C] transition-all duration-300 group gap-6 xl:gap-0"
                                >
                                {/* Left: Identity and Capacity */}
                                <div className="flex flex-col gap-6 xl:w-[40%]">
                                    {/* Identity */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-[#343434] overflow-hidden flex items-center justify-center text-[#6b7280] text-xl">
                                                👤
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#BCED09] border-2 border-[#161618] rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-base">{userFound[offer.creatorId]?.alias || "Unknown"}</span>
                                            <span className="text-[#BCED09] text-xs font-semibold mt-0.5 tracking-wide">1,420 ORDERS • 98.5%</span>
                                        </div>
                                    </div>
                                    
                                    {/* Capacity */}
                                    <div className="flex gap-12">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[#8F8389] text-[10px] font-bold tracking-widest uppercase">Available</span>
                                            <span className="text-white font-bold text-sm"><MerchantBalance publicKey={userFound[offer.creatorId]?.publicKey} assetCode={offer.assetCode} /> {offer.assetCode || "BTC"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[#8F8389] text-[10px] font-bold tracking-widest uppercase">Limits</span>
                                            <span className="text-white font-bold text-sm">${offer.minAmount} - ${offer.maxAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Flexibility */}
                                <div className="flex flex-col gap-4 xl:w-[30%] xl:border-l border-[#2D2D2D] xl:pl-8 justify-center">
                                    <span className="text-[#A1969C] text-[10px] font-bold tracking-widest uppercase">Payment Methods</span>
                                    <div className="flex flex-col gap-2.5">
                                        {paymentMethods.length > 0 ? (
                                            paymentMethods.slice(0, 3).map((pm, i) => (
                                                <span key={i} className="text-white font-bold text-sm uppercase tracking-wide">
                                                    {typeof pm === 'string' ? pm : (pm.payment_provider?.name || pm.bankName || pm.type || "WIRE")}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-white font-bold text-sm uppercase tracking-wide">WIRE</span>
                                        )}
                                        {paymentMethods.length > 3 && (
                                            <span className="text-[#8F8389] font-bold text-xs uppercase tracking-wide">+{paymentMethods.length - 3} MORE</span>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Immediate Action */}
                                <div className="flex flex-col items-start xl:items-end gap-5 xl:w-[30%] xl:border-l border-[#2D2D2D] xl:pr-4 justify-center">
                                    <div className="flex flex-col items-start xl:items-end gap-1.5">
                                        <span className="text-[#A1969C] text-[10px] font-bold tracking-widest uppercase">Unit Price</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[#BCED09] font-bold text-[32px] tabular-nums tracking-tight leading-none">
                                                {parseFloat(offer.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </span>
                                            <span className="text-[#8F8389] font-bold text-sm">USD</span>
                                        </div>
                                    </div>
                                    <button
                                        disabled={!isVerified}
                                        onClick={() => {
                                            if (!isVerified) {
                                                alert("KYC verification required to trade.");
                                                return;
                                            }
                                            setSelectedOffer(offer);
                                        }}
                                        className={`w-full max-w-[220px] py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${isVerified ? "bg-[#BCED09] text-black hover:shadow-[0_0_20px_rgba(188,237,9,0.25)] hover:scale-[1.02] active:scale-[0.98]" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                                    >
                                        {tab === "Buy" ? "BUY" : "SELL"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                    ) : (
                        <div className="flex justify-center py-20 text-[#8F8389] text-sm font-bold tracking-widest uppercase">
                            No offers found
                        </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <CreateOfferModal onClose={() => setIsOpen(false)} />
            )}

            {selectedOffer && userFound[selectedOffer.creatorId] && (
                <ConfirmOrderModal
                    offer={selectedOffer}
                    creator={userFound[selectedOffer.creatorId]}
                    onClose={() => setSelectedOffer(null)}
                />
            )}
        </div>
    );
}
