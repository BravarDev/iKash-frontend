"use client";

import { ActiveOrderMock } from "../mocks/active-orders.mock";

function getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
}

interface ActiveOrderCardProps {
    order: ActiveOrderMock;
}

function UsdcIcon() {
    return (
        <div className="w-7 h-7 rounded-full bg-[#2775CA] flex items-center justify-center shrink-0 border-2 border-[#3a8fe8]">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#2775CA" />
                <path
                    d="M20.022 18.124c0-2.124-1.28-2.854-3.84-3.153-1.828-.232-2.194-.696-2.194-1.508s.597-1.324 1.793-1.324c1.08 0 1.677.36 1.976 1.24.066.232.232.348.464.348h1.061a.425.425 0 00.43-.43v-.066a3.17 3.17 0 00-2.84-2.59V9.69a.476.476 0 00-.48-.48h-1.01a.476.476 0 00-.48.48v.895c-1.61.232-2.656 1.34-2.656 2.754 0 2.025 1.245 2.787 3.806 3.087 1.694.232 2.228.63 2.228 1.54 0 .91-.795 1.541-1.876 1.541-1.478 0-1.976-.629-2.128-1.508-.066-.265-.232-.397-.464-.397h-1.11a.425.425 0 00-.43.43v.066c.33 1.694 1.345 2.887 3.557 3.22v.928c0 .265.215.48.48.48h1.01c.265 0 .48-.215.48-.48v-.911c1.66-.298 2.722-1.44 2.722-2.971z"
                    fill="white"
                />
            </svg>
        </div>
    );
}

function BankIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#8F8389]">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M8 10v11M12 10v11M16 10v11M20 10v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
    const displayTime = getRelativeTime(order.updatedAt);

    const statusColors: Record<string, string> = {
        FUNDING: "border-[#BCED09] text-[#BCED09]",
        PENDING: "border-yellow-400 text-yellow-400",
        IN_PROGRESS: "border-blue-400 text-blue-400",
        COMPLETED: "border-green-400 text-green-400",
    };
    const statusClass = statusColors[order.status] ?? "border-[#8F8389] text-[#8F8389]";

    return (
        <div
            className="flex flex-col rounded-2xl bg-[#121214] border border-[#1f1f1f] overflow-hidden
                       min-w-[260px] w-full transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#151517]"
            data-testid="active-order-card"
        >
            {/* Top section */}
            <div className="flex flex-col gap-6 p-6">
                {/* Role + Status row */}
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.15em] text-[#8F8389] uppercase">
                        {order.role}
                    </span>
                    <span
                        className={`text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full border ${statusClass}`}
                    >
                        {order.status}
                    </span>
                </div>

                {/* Amount + Asset row */}
                <div className="flex items-center jusitfy-between">
                    <span className="text-[32px] font-bold text-white tracking-tight leading-none">
                        {order.assetAmount}
                    </span>
                    <div className="flex items-center gap-2">
                        <UsdcIcon />
                        <span className="text-[13px] font-semibold text-[#c0c0c0] tracking-wider">
                            {order.assetCode}
                        </span>
                    </div>
                </div>

                {/* Payment method */}
                <div className="flex items-center gap-2">
                    <BankIcon />
                    <span className="text-[13px] text-[#8F8389]">{order.paymentMethod}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1f1f1f] mx-5" />

            {/* Bottom section */}
            <div className="flex flex-col gap-4 p-5">
                {/* Counterparty */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] shrink-0" />
                    <div>
                        <p className="text-[13px] font-semibold text-white leading-tight">
                            {order.counterpartyName}
                        </p>
                        <p className="text-[11px] text-[#8F8389] leading-tight">
                            Unit price&nbsp;
                            <span className="font-bold text-[#c0c0c0]">
                                {order.unitPrice} {order.fiatCurrency}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Time + Open button */}
                <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#8F8389]">{displayTime}</span>
                    {/* Open button — disabled for mock orders to prevent invalid navigation */}
                    <button
                        disabled
                        title="Available once backend integration is enabled"
                        className="px-5 py-2 rounded-full bg-[#BCED09] text-black text-[13px] font-bold
                                   tracking-wide cursor-not-allowed opacity-90 transition-all duration-150
                                   hover:opacity-100"
                    >
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
}
