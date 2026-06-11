"use client";

import { useState } from "react";
import { BookOpen, Handshake, ShieldAlert, FileText, ChevronDown } from "lucide-react";

export default function PlatformFeaturesPage() {
  const [isDetailed, setIsDetailed] = useState(false);

  const faqs = [
    {
      q: "What payment methods are supported?",
      a: "iKash supports multiple local payment methods depending on your region, including Mobile money transfers (such as SINPE Móvil in Costa Rica), direct Bank transfers, and platform payments. Sellers specify their accepted methods when creating an offer.",
    },
    {
      q: "How does uploading payment evidence work?",
      a: "Once you transfer the funds via your banking app, take a screenshot of the confirmation. Upload this image in the order chat. The system hashes the file and records a cryptographic confirmation to prevent payment fraud and ensure mediators can resolve any disputes.",
    },
    {
      q: "Are my funds safe in the Stellar escrow?",
      a: "Yes. The Stellar smart contract locks the seller's assets and operates autonomously. Funds can only be released to your wallet once the payment receipt is uploaded and the seller signs off, or if a platform dispute resolution key resolves the trade based on objective bank transfer proof.",
    },
  ];

  return (
    <div className="space-y-8 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ffffff08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#BCED09]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Platform Features
          </h1>
        </div>

        {/* Density Toggle Button */}
        <div className="flex items-center bg-[#010308] border border-[#ffffff10] p-1 rounded-xl shrink-0 self-start">
          <button
            onClick={() => setIsDetailed(false)}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              !isDetailed
                ? "bg-[#BCED09] text-[#010308] shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Quick Overview
          </button>
          <button
            onClick={() => setIsDetailed(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              isDetailed
                ? "bg-[#BCED09] text-[#010308] shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Detailed Guide
          </button>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="space-y-8">
        {/* P2P Marketplace */}
        <div className="flex flex-col md:flex-row gap-6 items-start bg-[#18181b]/10 p-6 rounded-2xl border border-[#ffffff03]">
          <div className="w-12 h-12 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] shrink-0">
            <Handshake className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">P2P Marketplace</h3>
            {!isDetailed ? (
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                Connect directly with individual buyers and sellers. Purchase or sell stable assets (USDC) and native crypto (XLM) without any centralised exchange limits. Payments are settled bank-to-bank directly.
              </p>
            ) : (
              <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
                <p>
                  iKash's Peer-to-Peer (P2P) Marketplace acts as an open notice board of buy and sell offers. Users can create customized offers, defining their pricing, min/max transaction limits, and preferred local payment systems (e.g. Bank Transfer, SINPE Móvil).
                </p>
                <p>
                  Since there is no centralized brokerage or third-party balance account, fiat transactions are settled directly between users. The marketplace orchestrates these settlements by securing the corresponding crypto assets on the Stellar blockchain, ensuring neither party is exposed to counterparty risk.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stellar Escrow Contracts */}
        <div className="flex flex-col md:flex-row gap-6 items-start bg-[#18181b]/10 p-6 rounded-2xl border border-[#ffffff03]">
          <div className="w-12 h-12 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">Stellar-Compatible Escrows</h3>
            {!isDetailed ? (
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                Every trade is protected by an autonomous smart contract deployed on the Stellar blockchain. The contract securely holds the cryptocurrency until both parts confirm the fiat settlement, ensuring trustless execution.
              </p>
            ) : (
              <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
                <p>
                  Stellar Smart Escrows rely on multi-signature logic and milestone states managed through Trustless Work's blockchain protocols. When a trade is accepted, the contract is initialized with specific on-chain roles:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 font-light">
                  <li><strong>Seller</strong>: Retains the signing key to authorize release after receiving fiat.</li>
                  <li><strong>Buyer</strong>: Retains the key to lock funds and complete their milestone delivery on-chain.</li>
                  <li><strong>Platform Treasury/Support</strong>: Holds a key to resolve disputes and arbitrate conflicts based on objective cryptographic proof.</li>
                </ul>
                <p>
                  This setup prevents either party from unilaterally withdrawing funds. Crypto remains locked in the decentralized contract state until either mutual approval or support intervention.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Uploading Payment Evidence */}
        <div className="flex flex-col md:flex-row gap-6 items-start bg-[#18181b]/10 p-6 rounded-2xl border border-[#ffffff03]">
          <div className="w-12 h-12 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white text-lg">Payment Evidence & Chat</h3>
            {!isDetailed ? (
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                Use the integrated real-time chat to coordinate the bank transfer. Once payment is made, upload your screenshot or confirmation code. This receipt is cryptographically secured on the network for audit purposes.
              </p>
            ) : (
              <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
                <p>
                  After making a local bank transfer, the buyer uploads a receipt screenshot. iKash logs this event, updating the local database state to "fiat_sent" and notifying the seller in real-time.
                </p>
                <p>
                  This receipt serves as the primary evidence if a dispute arises. The support team can match the receipt's metadata (time, transaction code, beneficiary name) against bank registries to resolve the dispute impartially. In a regular trade, this upload unlocks the seller's ability to trigger the on-chain release transaction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature FAQ Accordion */}
      <div className="space-y-6 pt-6 border-t border-[#ffffff08]">
        <h2 className="text-xl font-bold text-white">Feature FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#18181b]/15 border border-[#ffffff05] rounded-2xl p-5 space-y-2"
            >
              <h4 className="font-bold text-sm text-white flex justify-between items-center">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </h4>
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
