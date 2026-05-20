"use client";

import { User, MoreVertical, SendHorizontal, Paperclip, Smile } from "lucide-react";

type ChatProps = {
    orderId: string;
    chatName?: string;
}

export const Chat = ({ orderId, chatName = "Merchant Chat" }: ChatProps) => {
    return (
        <div className="w-full h-full bg-[#1B1B21] flex flex-col overflow-hidden shrink-0 font-space select-none">
            {/* Header - HorizontalBorder */}
            <header className="h-[64px] border-b border-[rgba(69,73,50,0.1)] px-[24px] flex items-center justify-between shrink-0 bg-[#1B1B21]">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 bg-[#35343A] rounded-full flex items-center justify-center border border-white/[0.04] shrink-0">
                        <User className="w-4 h-4 text-white" />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#DAFF00] border border-[#1B1B21]" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-white font-bold text-[14px] leading-5 font-space">
                            {chatName}
                        </p>
                        <p className="text-[10px] font-bold leading-[15px] tracking-[0.5px] text-[#BCED09] uppercase">
                            Typically replies in 2m
                        </p>
                    </div>
                </div>
                {/* Options button */}
                <button className="text-[#8F8389] hover:text-white cursor-pointer px-1">
                    <MoreVertical className="w-5 h-5 text-[#8F8389]" />
                </button>
            </header>
            
            {/* Chat Messages Body - Scrollable */}
            <main className="flex-grow overflow-y-auto p-6 space-y-5 bg-[#1B1B21]/10 scrollbar-thin">
                {/* Order Created status banner */}
                <section className="flex items-center justify-center my-2 shrink-0">
                    <div className="bg-[#1F1F25] px-4 py-1.5 flex items-center justify-center rounded-full border border-[rgba(69,73,50,0.2)]">
                        <p className="uppercase text-[9px] text-[#8F9378] font-bold tracking-widest font-space">
                            ORDER CREATED - {orderId.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </section>

                {/* Seller Message (Left) */}
                <div className="flex flex-col items-start gap-1.5 max-w-[85%]">
                    <div className="bg-[#1F1F25] text-[#C2C7D0] text-[12px] leading-relaxed p-[12px_16px] rounded-r-[12px] rounded-bl-[12px] border border-white/[0.01] font-manrope font-medium">
                        Hello! I am online and ready to confirm. Please include the order ID in the transfer notes.
                    </div>
                    <span className="text-[9px] text-[#8F8389] pl-1 font-bold">14:21</span>
                </div>

                {/* Buyer Message (Right) */}
                <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[85%]">
                    <div className="bg-[#DAFF00] text-[#2B3400] font-semibold text-[12px] leading-relaxed p-[12px_16px] rounded-l-[12px] rounded-br-[12px] font-manrope">
                        Understood. Just initiated the transfer from my mobile app. Will upload the receipt in a moment.
                    </div>
                    <span className="text-[9px] text-[#8F8389] pr-1 font-bold">14:22 • Delivered</span>
                </div>

                {/* Seller Message (Left) */}
                <div className="flex flex-col items-start gap-1.5 max-w-[85%]">
                    <div className="bg-[#1F1F25] text-[#C2C7D0] text-[12px] leading-relaxed p-[12px_16px] rounded-r-[12px] rounded-bl-[12px] border border-white/[0.01] font-manrope font-medium">
                        Perfect. I'll be monitoring the incoming transactions.
                    </div>
                    <span className="text-[9px] text-[#8F8389] pl-1 font-bold">14:24</span>
                </div>
            </main>
            
            {/* Input message footer */}
            <footer className="h-[96px] bg-[#1B1B21] border-t border-[rgba(69,73,50,0.1)] flex flex-col justify-center px-6 shrink-0 gap-1.5">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        className="bg-[#0E0E13] text-white w-full h-[44px] pl-4 pr-12 rounded-[8px] border border-[rgba(69,73,50,0.3)] focus:border-[#DAFF00]/50 focus:outline-none placeholder:text-[#8F8389CC] text-[12px] font-semibold font-space" 
                        placeholder="Type a message..." 
                    />
                    <div className="absolute right-3 flex items-center gap-2">
                        <button className="text-[#DAFF00] hover:scale-105 transition-transform cursor-pointer">
                            <SendHorizontal className="w-5 h-5 text-[#DAFF00]" />
                        </button>
                    </div>
                </div>
                
                {/* Options attachments bar */}
                <div className="flex items-center justify-between px-1 text-[10px] text-[#8F8389] font-bold font-space uppercase tracking-wide">
                    <div className="flex items-center gap-3">
                        <button className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> Attach
                        </button>
                        <span>•</span>
                        <button className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                            <Smile className="w-3.5 h-3.5" /> Emoji
                        </button>
                    </div>
                    <span className="normal-case tracking-normal text-[9px] font-medium text-[#8F8389CC]">Press enter to send</span>
                </div>
            </footer>
        </div>
    );
}