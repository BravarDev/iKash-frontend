"use client";

import { use, useEffect, useState, useCallback } from "react";
import { Aside } from "@/app/components/Aside";
import { Header } from "@/app/components/Header";
import { TradeDetails } from "../components/TradeDetails";
import { TradeEvidence } from "../components/TradeEvidence";
import { Chat } from "../../p2p/components/Chat";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";
import { Order } from "@/features/order/models/order";
import { ArrowLeft, AlertTriangle, Ban, Loader2 } from "lucide-react";

interface PageProps {
    params: Promise<{ orderId: string }>;
}

function restoreUuidDashes(uuid: string): string {
    if (uuid.length !== 32) return uuid;
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

export default function TradePage({ params }: PageProps) {
    const { orderId } = use(params);
    const { currentUser } = useUser();
    const { getOrder } = useOrders();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchOrder = useCallback(async () => {
        try {
            const dashedId = restoreUuidDashes(orderId);
            const data = await getOrder(dashedId);
            if (!data) {
                setErrorMsg("Order not found");
            } else {
                setOrder(data);
            }
        } catch (err: any) {
            console.error("Error fetching order:", err);
            setErrorMsg("Error loading order details");
        } finally {
            setIsLoading(false);
        }
    }, [orderId, getOrder]);

    useEffect(() => {
        if (currentUser) {
            fetchOrder();
        }
    }, [currentUser, fetchOrder]);

    if (!currentUser) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <p className="text-white text-lg font-bold font-space">Please log in to view this trade.</p>
                    </main>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <Loader2 className="animate-spin h-12 w-12 text-[#DAFF00]" />
                        <p className="text-[#C2C7D0] mt-4 font-semibold font-space">Loading transaction details...</p>
                    </main>
                </div>
            </div>
        );
    }

    if (errorMsg || !order) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <AlertTriangle className="w-12 h-12 text-[#DAFF00] mb-2" />
                        <p className="text-white text-lg font-bold font-space">{errorMsg || "Transaction details unavailable"}</p>
                    </main>
                </div>
            </div>
        );
    }

    // Determine user's role
    const isBuyer = currentUser.userId === order.buyerId;
    const isSeller = currentUser.userId === order.sellerId;

    if (!isBuyer && !isSeller) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <Ban className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-white text-lg font-bold font-space">You are not authorized to view this trade.</p>
                    </main>
                </div>
            </div>
        );
    }

    const role = isBuyer ? "buyer" : "seller";
    const amountVal = parseFloat(order.assetAmount) || 0;
    const priceVal = parseFloat(order.offer?.price || "0") || 0;
    const totalVal = parseFloat(order.fiatAmount) || (amountVal * priceVal);
    
    // Extract payment details
    const paymentMethodObj = order.offer?.payment_methods?.[0] || order.offer?.paymentMethods?.[0];
    
    let paymentType: "platform" | "web" | "bank" = "bank";
    const typeStr = (paymentMethodObj?.payment_provider?.type || paymentMethodObj?.type || "bank").toLowerCase();
    if (typeStr.includes("platform") || typeStr.includes("internal")) {
        paymentType = "platform";
    } else if (typeStr.includes("web") || typeStr.includes("wallet") || typeStr.includes("online")) {
        paymentType = "web";
    } else {
        paymentType = "bank";
    }

    const paymentMethodLabel = paymentMethodObj?.payment_provider?.name || paymentMethodObj?.bankName || "Bank Transfer SEPA";
    
    // Support both Prisma camelCase serialization and standard snake_case
    const accountIdentifier = 
        paymentMethodObj?.accountIdentifier || 
        paymentMethodObj?.account_identifier || 
        paymentMethodObj?.accountDetails || 
        "No details provided";
        
    const accountOwner = 
        paymentMethodObj?.beneficiaryName || 
        paymentMethodObj?.beneficiary_name || 
        order.seller?.alias || 
        "QuantVortex_LP";

    // Escrow info
    const escrowId = order.escrow?.escrowId;
    const escrowStatus = order.escrow?.escrowStatus || "pending";
    const buyerAddress = order.escrow?.buyerAddress || order.buyer?.publicKey;
    const sellerAddress = order.escrow?.sellerAddress || order.seller?.publicKey;

    // Counterparty Info
    const counterpartyUser = isBuyer ? order.seller : order.buyer;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                {/* 1. Header (96px height) */}
                <Header description="trading floor" title="p2p marketplace" />
                
                {/* 2. Main Flex Container below Header (984px height) */}
                <main className="flex flex-row items-start w-full h-[calc(100vh-96px)] overflow-hidden bg-[#010308] min-h-0 select-none">
                    
                    {/* LEFT COLUMN: Section - Center Column: Transaction Details (1172px width) */}
                    <div className="w-[1172px] h-full flex flex-col border-r border-[rgba(69,73,50,0.1)] bg-[#010308] shrink-0 min-h-0">
                        
                        {/* Top Subheader Bar (64px height) */}
                        <div className="h-[64px] border-b border-[rgba(69,73,50,0.1)] bg-[rgba(19,19,24,0.6)] backdrop-blur-md px-[60px] flex items-center justify-between shrink-0">
                            {/* Left: Back to orders link */}
                            <button 
                                onClick={() => window.history.back()}
                                className="text-[#9CA3AF] hover:text-white flex items-center gap-2 text-[14px] font-bold uppercase tracking-[-0.35px] transition-colors cursor-pointer font-space"
                            >
                                <ArrowLeft className="w-4 h-4 text-[#9CA3AF] stroke-[3px]" /> BACK TO ORDERS
                            </button>
                            
                            {/* Center: Blinking Transaction indicator */}
                            <div className="flex items-center gap-3 select-none">
                                <span className="w-2 h-2 rounded-full bg-[#DAFF00] animate-pulse shadow-[0_0_8px_rgba(218,255,0,0.6)]" />
                                <span className="text-[#DAFF00] text-[12px] font-bold tracking-[2.4px] uppercase font-space">
                                    TRANSACTION IN PROGRESS
                                </span>
                            </div>

                            {/* Right: Order details title */}
                            <h2 className="text-white font-black text-[20px] leading-7 uppercase tracking-normal font-space">
                                ORDER DETAILS
                            </h2>
                        </div>

                        {/* Main Left Content Panel Area */}
                        <div className="flex-grow flex flex-col p-[40px_64px] gap-[32px] overflow-hidden justify-center items-center min-h-0">
                            {/* Cards Row (1043px width) */}
                            <div className="flex flex-row items-start gap-[24px] shrink-0 min-h-0 w-[1043px] h-[571.5px]">
                                {/* Card 1: BUYING (616.2px width, 571.5px height) */}
                                <TradeDetails 
                                    role={role}
                                    amount={amountVal}
                                    assetCode={order.offer?.assetCode || "XLM"}
                                    unitPrice={priceVal}
                                    total={totalVal}
                                    paymentMethod={paymentMethodLabel}
                                    paymentType={paymentType}
                                    accountIdentifier={accountIdentifier}
                                    accountOwner={accountOwner}
                                    counterpartyName={counterpartyUser?.alias || (isBuyer ? "Seller" : "Buyer")}
                                    counterpartyRate={isBuyer ? "90.8%" : "95.5%"}
                                    counterpartyKyc={counterpartyUser?.kycStatus === "approved"}
                                />

                                {/* Card 2: Evidence Area (402.8px width, 571.5px height) */}
                                <TradeEvidence 
                                    role={role}
                                    orderId={order.orderId}
                                    escrowId={escrowId}
                                    escrowStatus={escrowStatus}
                                    buyerAddress={buyerAddress}
                                    sellerAddress={sellerAddress}
                                    amount={amountVal}
                                    expiresAt={order.expiresAt as string | undefined}
                                    onStatusChange={fetchOrder}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Section - Right Column: Chat Interface (460px width) */}
                    <div className="w-[460px] h-full bg-[#1B1B21] flex flex-col shrink-0 min-h-0">
                        <Chat 
                            orderId={order.orderId} 
                            chatName={counterpartyUser?.alias || (isBuyer ? "Seller" : "Buyer")} 
                        />
                    </div>

                </main>
            </div>
        </div>
    );
}
