"use client";

import { useState } from "react";
import { User, Landmark, Copy, Check, Shield, Globe, ChevronDown, ChevronUp } from "lucide-react";

export interface TradeDetailsProps {
    role: "buyer" | "seller";
    amount: number;
    assetCode: string;
    unitPrice: number;
    total: number;
    paymentMethod: string;
    paymentType?: "platform" | "web" | "bank";
    accountIdentifier?: string;
    accountOwner?: string;
    counterpartyName?: string;
    counterpartyRate?: string;
    counterpartyKyc?: boolean;
}

export function TradeDetails({ 
    role, 
    amount, 
    assetCode, 
    unitPrice, 
    total, 
    paymentMethod,
    paymentType = "bank",
    accountIdentifier = "N/A",
    accountOwner = "QuantVortex_LP",
    counterpartyName = "QuantVortex_LP",
    counterpartyRate = "90.8%",
    counterpartyKyc = true
}: TradeDetailsProps) {
    const isBuyer = role === "buyer";
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent accordion toggle
        navigator.clipboard.writeText(accountIdentifier);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine the icon according to type
    const renderPaymentIcon = () => {
        switch (paymentType) {
            case "platform":
                return <Shield className="w-5 h-5 text-[#C2C7D0]" />;
            case "web":
                return <Globe className="w-5 h-5 text-[#C2C7D0]" />;
            case "bank":
            default:
                return <Landmark className="w-5 h-5 text-[#C2C7D0]" />;
        }
    };

    return (
        <div className="bg-[#161618] w-[616.2px] h-[571.5px] border-l-4 border-[#DAFF00] rounded-r-[12px] flex flex-col justify-between p-8 font-space shrink-0 select-none">
            {/* Top row */}
            <div className="flex flex-row justify-between items-start w-full h-[60px] shrink-0">
                <div className="flex flex-col gap-1">
                    <p className="text-[#C2C7D0] text-[12px] leading-4 tracking-[1.2px] uppercase font-normal font-space">
                        OPERATION TYPE
                    </p>
                    <h2 className="text-white font-bold text-[30px] leading-9 tracking-[-0.75px] uppercase font-space">
                        {isBuyer ? "BUYING" : "SELLING"}
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <p className="text-[#C2C7D0] text-[12px] leading-4 tracking-[1.2px] uppercase font-normal text-right font-space">
                        ASSET AMOUNT
                    </p>
                    <h2 className="text-[#DAFF00] font-extrabold text-[36px] leading-[40px] tracking-[-1.8px] text-right font-space">
                        {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {assetCode}
                    </h2>
                </div>
            </div>
            
            {/* Inputs body */}
            <div className="flex flex-col gap-4 flex-grow justify-center mt-2 shrink-0">
                {/* Unit Price */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-[#8F9378] text-[10px] font-bold tracking-[1px] uppercase font-space">
                        UNIT PRICE
                    </p>
                    <div className="bg-[#0E0E13] text-white w-full h-[62px] px-4 flex items-center justify-between font-bold rounded-none border border-[rgba(69,73,50,0.2)]">
                        <span className="text-[20px] leading-7 font-bold text-white font-space">
                            {unitPrice.toFixed(4)}
                        </span>
                        <span className="text-[#C2C7D0] text-[12px] font-bold leading-4 font-space">
                            USD/{assetCode}
                        </span>
                    </div>
                </div>
                
                {/* Total Asset Value */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-[#8F9378] text-[10px] font-bold tracking-[1px] uppercase font-space">
                        TOTAL ASSET VALUE
                    </p>
                    <div className="bg-[#0E0E13] text-[#DAFF00] w-full h-[62px] px-4 flex items-center justify-between font-bold rounded-none border border-[rgba(69,73,50,0.2)]">
                        <span className="text-[20px] leading-7 font-bold text-[#DAFF00] font-space">
                            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[#C2C7D0] text-[12px] font-bold leading-4 font-space">
                            USD
                        </span>
                    </div>
                </div>

                {/* Counterparty Block */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-[#8F9378] text-[10px] font-bold tracking-[1px] uppercase font-space">
                        COUNTERPARTY
                    </p>
                    <div className="flex items-center gap-3 h-[40px]">
                        <div className="w-8 h-8 rounded-[12px] bg-[#35343A] flex items-center justify-center border border-white/[0.04] shrink-0">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold text-[14px] leading-5 truncate font-space">
                                    {counterpartyName}
                                </span>
                                {counterpartyKyc && (
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#DAFF00] flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5 text-black stroke-[4px]" />
                                    </span>
                                )}
                            </div>
                            <span className="text-[#BCED09] text-[10px] font-bold leading-[15px] tracking-[0.5px] uppercase font-space">
                                Verified Merchant • {counterpartyRate} completion
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Method - Accordion Collapsible Box */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-[#8F9378] text-[10px] font-bold tracking-[1px] uppercase font-space">
                        PAYMENT METHOD
                    </p>
                    <div 
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        className={`bg-[#1F1F25] text-white w-full flex flex-col font-medium rounded-none border border-white/[0.02] cursor-pointer transition-all duration-300 ${
                            isAccordionOpen ? "p-4 gap-3.5" : "h-[52px] px-4 flex-row items-center justify-between"
                        }`}
                    >
                        {/* Header of the Accordion */}
                        <div className={`flex items-center justify-between w-full ${isAccordionOpen ? "" : "h-full"}`}>
                            <div className="flex items-center gap-3">
                                {renderPaymentIcon()}
                                <span className="text-[14px] leading-5 text-[#E4E1E9] font-medium font-manrope">
                                    {paymentMethod}
                                </span>
                            </div>
                            
                            {/* Copy button & Toggle Arrow */}
                            <div className="flex items-center gap-3">
                                <button 
                                    type="button" 
                                    onClick={handleCopy}
                                    className="p-1 rounded hover:bg-white/[0.04] active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                    {copied ? (
                                        <>
                                            <span className="text-[9px] text-[#DAFF00] uppercase font-extrabold tracking-wider font-space">Copied!</span>
                                            <Check className="w-4 h-4 text-[#DAFF00] stroke-[3px]" />
                                        </>
                                    ) : (
                                        <Copy className="w-4 h-4 text-[#C2C7D0] hover:text-white transition-colors" />
                                    )}
                                </button>
                                {isAccordionOpen ? (
                                    <ChevronUp className="w-4 h-4 text-[#C2C7D0]" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-[#C2C7D0]" />
                                )}
                            </div>
                        </div>

                        {/* Collapsible Content */}
                        {isAccordionOpen && (
                            <div className="border-t border-[rgba(69,73,50,0.15)] pt-3 flex flex-col gap-3 font-space animate-fadeIn">
                                {/* Account Identifier */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#8F9378] text-[9px] font-bold tracking-[1px] uppercase">
                                        ACCOUNT IDENTIFIER
                                    </p>
                                    <span className="text-white text-[12px] font-mono select-all bg-[#0E0E13] px-3 py-2 border border-white/[0.03] rounded">
                                        {accountIdentifier}
                                    </span>
                                </div>
                                {/* Account Owner */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#8F9378] text-[9px] font-bold tracking-[1px] uppercase">
                                        ACCOUNT OWNER
                                    </p>
                                    <span className="text-white text-[12px] font-semibold pl-1">
                                        {accountOwner}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
