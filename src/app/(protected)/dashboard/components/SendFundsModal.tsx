'use client';

import Image from 'next/image';
import { CloseModalProps } from "@/app/utils/closeModalProps";
import { useState, useEffect } from "react";
import { useWallet, useWalletBalance, type AssetBalance } from "@/features/wallet";
import { useSend } from "@/features/wallet/presentation/hooks/useSend";

function truncateAddress(addr: string) {
    return addr.length > 16 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;
}

function getAssetName(a: AssetBalance) {
    return a.asset_type === "native" ? "XLM" : (a.asset_code || "UNKNOWN");
}

function getFormattedBalance(a: AssetBalance) {
    return parseFloat(a.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });
}

function AssetIcon({ name, size = 32 }: { name: string; size?: number }) {
    if (name === "XLM") return <Image src="/xlm.png" alt="XLM" width={size} height={size} className="w-full h-full object-cover" />;
    if (name === "USDC") return <Image src="/usdc.png" alt="USDC" width={size} height={size} className="w-full h-full object-cover" />;
    return <span className="text-[10px] font-bold text-white">{name.slice(0, 3)}</span>;
}

const LOADING_MESSAGES: Partial<Record<string, string>> = {
    loading: "Resolving & preparing transaction...",
    signing: "Approve the transaction in your wallet...",
    submitting: "Submitting to Stellar network...",
};

export function SendFundsModal({ onClose }: CloseModalProps) {
    const { publicKey } = useWallet();
    const { balances } = useWalletBalance(publicKey);
    const { state, resolveAndPrepare, confirmSend, reset, backToConfirm } = useSend();

    const defaultAsset: AssetBalance = { asset_type: "native", asset_code: "XLM", asset_issuer: null, balance: "0.00" };
    const usdcBalance = balances.find(b => b.asset_code === "USDC") ?? null;
    const sendableAsset: AssetBalance = usdcBalance ?? { asset_type: "credit_alphanum4", asset_code: "USDC", asset_issuer: null, balance: "0.00" };

    const [recipientInput, setRecipientInput] = useState("");
    const [amount, setAmount] = useState("");
    const [inputError, setInputError] = useState<string | null>(null);

    const assetName = getAssetName(sendableAsset);
    const isTransacting = state.step === "loading" || state.step === "signing" || state.step === "submitting";

    const feeNum = state.fee ? parseFloat(state.fee) : 0;
    const amountNum = parseFloat(amount || "0");
    const totalNum = amountNum + feeNum;
    const feeDisplay = feeNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });
    const totalDisplay = totalNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });

    const handleClose = () => {
        reset();
        onClose();
    };

    const isStellarAddress = (v: string) => /^G[A-Z0-9]{55}$/.test(v);

    const handleReviewSend = () => {
        const trimmed = recipientInput.trim();
        if (!trimmed || !amount || parseFloat(amount) <= 0) return;
        if (!isStellarAddress(trimmed)) {
            setInputError("Only Stellar addresses (starting with G) are supported right now. Alias resolution is coming soon.");
            return;
        }
        setInputError(null);
        resolveAndPrepare(trimmed, amount);
    };

    const headerTitle =
        state.step === "success" ? "Transfer Complete" :
        state.step === "error" ? "Transaction Failed" :
        state.step === "cancelled" ? "Cancelled" :
        state.step === "confirm" ? "Confirm Send" :
        "Send Funds";

    const headerSubtitle =
        state.step === "form" ? "Instant cross-border crypto transfers." :
        state.step === "confirm" ? "Review the details before signing." :
        state.step === "success" ? "Your transfer was successful." :
        state.step === "error" ? "Something went wrong." :
        state.step === "cancelled" ? "You declined the transaction." : "";

    return (
        <div
            className="fixed inset-0 bg-[black/60] backdrop-blur-sm z-40 flex items-center justify-end"
            onClick={!isTransacting ? handleClose : undefined}
        >
            <div
                className="bg-[#0D1117F2] h-full w-md p-8 border-r border-white/10 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-white text-[30px] font-bold uppercase">{headerTitle}</h2>
                        {headerSubtitle && <p className="text-[#C2C7D0] text-[14px]">{headerSubtitle}</p>}
                    </div>
                    {!isTransacting && (
                        <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(to right, #BCED0900, #BCED09, #BCED0900)' }} />

                {/* Form */}
                {state.step === "form" && (
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="flex flex-col">
                            <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">Recipient Address or Alias</p>
                            <input
                                type="text"
                                placeholder="alex.ikash or GXXXXXX..."
                                value={recipientInput}
                                onChange={e => { setRecipientInput(e.target.value); setInputError(null); }}
                                className="w-full rounded-xl border border-[#45493233] bg-[#1B1B21] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#BCED09]"
                            />
                            {inputError
                                ? <span className="text-red-400 text-[11px] mt-2">{inputError}</span>
                                : <span className="text-[#C2C7D099] text-[10px] mt-2">Verified iKa$h names are cheaper to send to.</span>
                            }
                        </div>

                        <div>
                            <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">Asset</p>
                            <div className="bg-[#0D1117] border border-[#1C2128] rounded-xl px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#1a2a3a] flex items-center justify-center border border-[#2a2a2a]">
                                            <AssetIcon name="USDC" size={32} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[#FFFFFF] text-[14px] font-bold">USDC</span>
                                            <span className="text-[10px] text-[#C2C7D0] uppercase">Balance: {getFormattedBalance(sendableAsset)}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-[#C2C7D099] uppercase tracking-wide">Only asset supported</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">Amount to send</p>
                            <div className="relative mt-1">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    min={0}
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    onKeyDown={e => ["-", "e", "E"].includes(e.key) && e.preventDefault()}
                                    className="bg-[#0D1117] w-full border border-[#1C2128] rounded-xl px-5 py-4 text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#BCED09] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <span className="text-[14px] text-[#94A3B8] font-bold select-none">{assetName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-center mt-auto pt-4">
                            <button
                                onClick={handleReviewSend}
                                disabled={!recipientInput.trim() || !amount || parseFloat(amount) <= 0}
                                className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Review & Send
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading / Signing / Submitting */}
                {isTransacting && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-5">
                        <div className="w-12 h-12 border-2 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#C2C7D0] text-sm text-center">
                            {LOADING_MESSAGES[state.step] ?? ""}
                        </p>
                    </div>
                )}

                {/* Confirm */}
                {state.step === "confirm" && state.recipient && (
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="bg-[#0D1117] border border-[#1C2128] rounded-xl p-5">
                            <p className="text-[#C2C7D0] text-[11px] uppercase mb-3">Sending to</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center border border-[#2a2a2a] text-white font-bold text-sm shrink-0">
                                    {state.recipient.alias ? state.recipient.alias.slice(0, 2).toUpperCase() : "?"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    {state.recipient.alias && (
                                        <span className="text-white font-bold text-sm">{state.recipient.alias}</span>
                                    )}
                                    <span className="text-[#C2C7D0] text-[12px] font-mono">
                                        {truncateAddress(state.recipient.address)}
                                    </span>
                                    {!state.recipient.exists && (
                                        <span className="text-yellow-400 text-[10px] mt-1">No iKash account — sending to raw address</span>
                                    )}
                                </div>
                            </div>
                            {assetName === "USDC" && !state.recipient.hasUsdcTrustline && (
                                <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                    <p className="text-yellow-400 text-[11px]">
                                        Warning: This recipient may not have a USDC trustline. The transaction may fail.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#0D1117] border border-[#1C2128] rounded-xl p-5">
                            <p className="text-[#C2C7D0] text-[11px] uppercase mb-3">Transaction Details</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#C2C7D0] text-sm">Amount</span>
                                    <span className="text-white text-sm font-bold tabular-nums">{amount} {assetName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#C2C7D0] text-sm">iKash Fee (0.3%)</span>
                                    <span className="text-white text-sm font-bold tabular-nums">{feeDisplay} {assetName}</span>
                                </div>
                                <div className="w-full h-px bg-[#1C2128] my-1" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[#C2C7D0] text-sm font-semibold">Total Deducted</span>
                                    <span className="text-[#BCED09] text-sm font-bold tabular-nums">{totalDisplay} {assetName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto pt-2">
                            <button
                                onClick={reset}
                                className="flex-1 bg-[#1C2128] uppercase text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmSend}
                                className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                            >
                                Sign & Send
                            </button>
                        </div>
                    </div>
                )}

                {/* Success */}
                {state.step === "success" && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-6">
                        <div className="w-16 h-16 rounded-full bg-[#BCED09]/10 border border-[#BCED09]/30 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#BCED09" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-[#C2C7D0] text-sm">
                                {amount} {assetName} sent successfully.
                            </p>
                        </div>
                        {state.txHash && (
                            <div className="w-full bg-[#0D1117] border border-[#1C2128] rounded-xl p-4">
                                <p className="text-[#C2C7D0] text-[11px] uppercase mb-2">Transaction Hash</p>
                                <p className="text-white text-[11px] font-mono break-all">{state.txHash}</p>
                            </div>
                        )}
                        <button
                            onClick={handleClose}
                            className="w-full bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors mt-2"
                        >
                            Done
                        </button>
                    </div>
                )}

                {/* Error */}
                {state.step === "error" && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        {state.errorMessage && (
                            <p className="text-red-400 text-sm text-center">{state.errorMessage}</p>
                        )}
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handleClose}
                                className="flex-1 bg-[#1C2128] uppercase text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
                            >
                                Close
                            </button>
                            <button
                                onClick={reset}
                                className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Cancelled */}
                {state.step === "cancelled" && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-6">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <p className="text-[#C2C7D0] text-sm text-center">You declined the transaction in your wallet.</p>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={reset}
                                className="flex-1 bg-[#1C2128] uppercase text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={backToConfirm}
                                className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
