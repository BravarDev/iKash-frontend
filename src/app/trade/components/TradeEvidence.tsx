"use client";

import { useState, useRef, useEffect } from "react";
import { useEscrows } from "@/features/escrow/hooks/useEscrows";
import { useOrders } from "@/features/order/hooks/useOrders";
import { walletService } from "@/features/wallet/application/wallet.service";
import { Info, Upload, FileUp, CircleCheck, Loader2, Eye } from "lucide-react";

export interface TradeEvidenceProps {
    role: "buyer" | "seller";
    orderId: string;
    escrowId?: string | null;
    escrowStatus: "pending" | "initialized" | "funded" | "fiat_sent" | "released" | "disputed" | "resolved";
    buyerAddress?: string | null;
    sellerAddress?: string | null;
    amount: number;
    expiresAt?: string;
    onStatusChange: () => void;
}

export function TradeEvidence({
    role,
    orderId,
    escrowId,
    escrowStatus,
    buyerAddress,
    sellerAddress,
    amount,
    expiresAt,
    onStatusChange
}: TradeEvidenceProps) {
    const isBuyer = role === "buyer";
    const { fundEscrow, syncEscrow, markFiatSent, releaseEscrow } = useEscrows();
    const { updateOrder } = useOrders();

    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [timeLeft, setTimeLeft] = useState<string>("00:00");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;
        
        const target = new Date(expiresAt).getTime();
        
        const updateTimer = () => {
            const now = Date.now();
            const diff = target - now;
            if (diff <= 0) {
                setTimeLeft("00:00");
                setIsExpired(true);
            } else {
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                setIsExpired(false);
            }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const sizeInKb = (file.size / 1024).toFixed(1);
            setUploadedFile({ name: file.name, size: `${sizeInKb} KB` });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const sizeInKb = (file.size / 1024).toFixed(1);
            setUploadedFile({ name: file.name, size: `${sizeInKb} KB` });
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAction = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (escrowStatus === "pending" || escrowStatus === "initialized") {
                if (!isBuyer && sellerAddress && escrowId) {
                    const res = await fundEscrow({
                        escrowId,
                        signerAddress: sellerAddress,
                        amount
                    });
                    const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
                    if (!unsignedXdr) throw new Error("Funding failed: no unsigned XDR returned");
                    const signedXdr = await walletService.signTransaction(unsignedXdr);
                    await syncEscrow({ escrowId, action: "fund", signedXdr });
                    await updateOrder({ orderStatus: "locked" }, orderId);
                    alert("Escrow funded successfully on-chain!");
                    onStatusChange();
                }
            } else if (escrowStatus === "funded") {
                if (isBuyer && buyerAddress && escrowId) {
                    const res = await markFiatSent(escrowId, {
                        buyerAddress,
                        evidence: uploadedFile ? `File: ${uploadedFile.name}` : "Payment evidence"
                    });
                    const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
                    if (!unsignedXdr) throw new Error("Confirmation failed: no unsigned XDR returned");
                    const signedXdr = await walletService.signTransaction(unsignedXdr);
                    await syncEscrow({ escrowId, action: "fiat_sent", signedXdr });
                    alert("Payment confirmed and registered successfully!");
                    onStatusChange();
                }
            } else if (escrowStatus === "fiat_sent") {
                if (!isBuyer && sellerAddress && escrowId) {
                    const res = await releaseEscrow({
                        escrowId,
                        releaseSigner: sellerAddress
                    });
                    const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
                    if (!unsignedXdr) throw new Error("Release failed: no unsigned XDR returned");
                    const signedXdr = await walletService.signTransaction(unsignedXdr);
                    await syncEscrow({ escrowId, action: "release", signedXdr });
                    await updateOrder({ orderStatus: "released" }, orderId);
                    alert("Crypto released successfully to the buyer!");
                    onStatusChange();
                }
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error processing action: ${err.message || err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel this P2P operation?")) {
            alert("Operation cancelled.");
        }
    };

    const renderStatusDescription = () => {
        switch (escrowStatus) {
            case "pending":
            case "initialized":
                return isBuyer 
                    ? "Waiting for the seller to lock the funds in the smart Escrow contract." 
                    : "You must fund the Escrow contract to lock the crypto so the buyer can proceed.";
            case "funded":
                return isBuyer 
                    ? "Ensure the payment receipt clearly shows the destination IBAN and transaction reference. Operations are monitored 24/7 for security." 
                    : "The buyer is currently transferring fiat funds. You will be notified when marked as paid.";
            case "fiat_sent":
                return isBuyer 
                    ? "Payment sent! Waiting for the seller to verify the funds and release the locked crypto from the escrow." 
                    : "The buyer has marked the payment as sent! Please verify the funds are cleared in your bank account before releasing the crypto.";
            case "released":
                return "The transaction has been successfully completed. The cryptocurrency has been released to the buyer.";
            default:
                return "Transaction in progress.";
        }
    };

    return (
        <div className="bg-[#161618] w-[402.8px] h-[571.5px] rounded-[16px] flex flex-col justify-between p-[12px_16px] gap-6 font-space shrink-0 select-none">
            
            {/* 1. Header Info Banner */}
            <div className="bg-[#1B1B21] border-l border-[rgba(69,73,50,0.3)] rounded-[8px] p-[20px_12px] h-[99px] flex gap-3 shrink-0">
                <span className="w-[11.67px] h-[11.67px] bg-[#DAFF00] rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_8px_rgba(218,255,0,0.5)]">
                    <Info className="w-[8px] h-[8px] text-black stroke-[3.5px]" />
                </span>
                <p className="text-[#C2C7D0] text-[12px] leading-[20px] font-manrope font-normal">
                    {renderStatusDescription()}
                </p>
            </div>

            {/* 2. Upload / Preview Body Area */}
            <div className="flex-1 flex flex-col justify-center items-center gap-4 shrink-0 min-h-0">
                {escrowStatus === "funded" && isBuyer ? (
                    <div className="w-full h-full flex flex-col gap-4">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*,application/pdf"
                        />
                        
                        {/* UPLOAD EVIDENCE BUTTON */}
                        <button 
                            type="button" 
                            onClick={triggerUpload}
                            className="bg-[#DAFF00] w-full h-[48px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 flex items-center justify-center gap-2 select-none tracking-[-0.4px]"
                        >
                            <Upload className="w-4.5 h-4.5 text-[#2B3400] stroke-[2.5px]" /> Upload Evidence
                        </button>

                        {/* DRAG AND DROP ZONE */}
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerUpload}
                            className={`border-2 border-dashed w-full h-[214.5px] rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
                                isDragging 
                                ? "border-[#DAFF00] bg-[#DAFF00]/5" 
                                : uploadedFile 
                                    ? "border-[#DAFF00]/50 bg-[#1B1B21]" 
                                    : "border-[rgba(143,131,137,0.8)] hover:border-[#DAFF00]/40 bg-[#161618]"
                            }`}
                        >
                            {uploadedFile ? (
                                <div className="text-center p-4">
                                    <p className="text-[14px] font-bold text-[#DAFF00] truncate max-w-[240px]">{uploadedFile.name}</p>
                                    <p className="text-[11px] text-[rgba(143,131,137,0.8)] mt-1 font-semibold">{uploadedFile.size}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <FileUp className="w-8 h-8 text-[rgba(143,131,137,0.8)]" />
                                    <p className="text-[16px] font-medium leading-[24px] text-[rgba(143,131,137,0.8)] text-center tracking-normal font-space max-w-[200px]">
                                        Drop your evidence file here
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Display Mock Evidence state or completed evidence preview
                    <div className="w-full h-full flex flex-col gap-4">
                        {!isBuyer && (escrowStatus === "fiat_sent" || escrowStatus === "released") ? (
                            <button 
                                type="button" 
                                onClick={() => alert("Opening receipt...")}
                                className="bg-[#1F1F25] border border-white/[0.04] w-full h-[48px] text-[#DAFF00] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase flex items-center justify-center gap-2 select-none tracking-[-0.4px] hover:bg-white/[0.04] transition-colors"
                            >
                                <Eye className="w-4.5 h-4.5 text-[#DAFF00] stroke-[2.5px]" /> VIEW RECEIPT
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                disabled
                                className="bg-[#1F1F25] border border-white/[0.04] w-full h-[48px] text-[rgba(143,131,137,0.5)] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase flex items-center justify-center gap-2 select-none tracking-[-0.4px] cursor-not-allowed"
                            >
                                <Upload className="w-4.5 h-4.5 text-[rgba(143,131,137,0.5)] stroke-[2.5px]" /> UPLOAD EVIDENCE
                            </button>
                        )}

                        <div className="border-2 border-dashed border-[rgba(143,131,137,0.4)] bg-[#1B1B21]/20 w-full h-[214.5px] rounded-[12px] flex flex-col items-center justify-center opacity-70">
                            {uploadedFile || escrowStatus === "fiat_sent" || escrowStatus === "released" ? (
                                <div className="text-center p-4">
                                    <span className="text-3xl mb-2 block">📄</span>
                                    <p className="text-[14px] font-bold text-[#DAFF00] truncate max-w-[240px]">
                                        {uploadedFile?.name || "evidence_receipt.png"}
                                    </p>
                                    <p className="text-[11px] text-[rgba(143,131,137,0.8)] mt-1 font-semibold">
                                        {uploadedFile?.size || "412.5 KB"} • Uploaded
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <FileUp className="w-8 h-8 text-[rgba(143,131,137,0.5)] mb-2" />
                                    <p className="text-[14px] text-[rgba(143,131,137,0.8)] font-bold">No evidence uploaded</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Action Buttons Footer Block */}
            <div className="flex flex-col gap-3 shrink-0">
                {escrowStatus === "pending" || escrowStatus === "initialized" ? (
                    !isBuyer ? (
                        <button 
                            type="button" 
                            onClick={handleAction}
                            disabled={isSubmitting}
                            className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" />
                            ) : (
                                <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />
                            )}
                            {isSubmitting ? "PROCESSING..." : "FUND ESCROW"}
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            disabled 
                            className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px]"
                        >
                            WAITING FOR FUNDING
                        </button>
                    )
                ) : escrowStatus === "funded" ? (
                    isBuyer ? (
                        <button 
                            type="button" 
                            onClick={handleAction}
                            disabled={isSubmitting}
                            className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" />
                            ) : (
                                <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />
                            )}
                            {isSubmitting ? "PROCESSING..." : "MARK AS PAID"}
                        </button>
                    ) : (
                        isExpired ? (
                            <div className="bg-[#1F1F25] border border-red-500/50 w-full h-[56px] rounded-[12px] flex items-center justify-center">
                                <span className="text-red-500 font-bold text-[16px] leading-[24px] uppercase tracking-[-0.4px]">EXPIRED</span>
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                disabled 
                                className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px] flex items-center justify-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#DAFF00] animate-pulse shadow-[0_0_8px_rgba(218,255,0,0.6)]" />
                                WAITING FOR PAYMENT ({timeLeft})
                            </button>
                        )
                    )
                ) : escrowStatus === "fiat_sent" ? (
                    !isBuyer ? (
                        <button 
                            type="button" 
                            onClick={handleAction}
                            disabled={isSubmitting}
                            className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" />
                            ) : (
                                <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />
                            )}
                            {isSubmitting ? "PROCESSING..." : "RELEASE CRYPTO"}
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            disabled 
                            className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px]"
                        >
                            WAITING FOR RELEASE
                        </button>
                    )
                ) : escrowStatus === "released" ? (
                    <div className="bg-[#DAFF00]/10 border border-[#DAFF00]/30 w-full h-[56px] rounded-[12px] flex items-center justify-center">
                        <span className="text-[#DAFF00] font-bold text-[16px] leading-[24px] uppercase tracking-[-0.4px]">COMPLETED!</span>
                    </div>
                ) : null}

                {/* Cancel Action Button (only if not completed) */}
                {escrowStatus !== "released" && (
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="bg-transparent hover:bg-white/[0.02] w-full h-[58px] text-[#C2C7D0] border border-[rgba(69,73,50,0.3)] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase transition-all duration-200 tracking-[-0.4px]"
                    >
                        CANCEL OPERATION
                    </button>
                )}
            </div>
        </div>
    );
}
