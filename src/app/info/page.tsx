"use client";

import { useState } from "react";
import { Compass, Zap, Layers, RefreshCw } from "lucide-react";

export default function PlatformOverviewPage() {
  const [isDetailed, setIsDetailed] = useState(false);

  return (
    <div className="space-y-8 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ffffff08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#BCED09]">
            <Compass className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Platform Overview
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

      {/* Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18181b]/35 border border-[#ffffff05] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Speed & Efficiency</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Trades execute instantly. By utilizing the Stellar network, asset lockups and transfers take under 5 seconds to settle on-chain.
          </p>
        </div>

        <div className="bg-[#18181b]/35 border border-[#ffffff05] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09]">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Non-Custodial Escrow</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Funds are locked in decentralised smart contracts, meaning iKash never holds custody of your crypto assets during transactions.
          </p>
        </div>

        <div className="bg-[#18181b]/35 border border-[#ffffff05] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Direct Peer-to-Peer</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            No middleman brokers. Bank transfers are conducted directly from bank account to bank account using secure local payment systems.
          </p>
        </div>
      </div>

      {/* Main Flow Content */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">How iKash Works</h2>

        {!isDetailed ? (
          /* Quick Overview (Brief Visual Flow) */
          <div className="relative border-l-2 border-[#BCED09]/20 pl-6 ml-3 space-y-8 py-2">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-[#010308] border-2 border-[#BCED09] flex items-center justify-center text-[10px] font-black text-[#BCED09]">
                1
              </span>
              <h4 className="font-bold text-sm text-white">Wallet Connection & Identity Verification</h4>
              <p className="text-gray-400 text-xs font-light mt-1">
                Link any Stellar-compatible wallet and run a simple Didit verification to ensure a safe, fraud-free environment.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-[#010308] border-2 border-[#BCED09] flex items-center justify-center text-[10px] font-black text-[#BCED09]">
                2
              </span>
              <h4 className="font-bold text-sm text-white">Locking the Assets on the Blockchain</h4>
              <p className="text-gray-400 text-xs font-light mt-1">
                The seller accepts an offer and deposits the crypto (USDC/XLM) directly into the secure, blockchain-enforced contract.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-[#010308] border-2 border-[#BCED09] flex items-center justify-center text-[10px] font-black text-[#BCED09]">
                3
              </span>
              <h4 className="font-bold text-sm text-white">Direct Fiat Bank Transfer</h4>
              <p className="text-gray-400 text-xs font-light mt-1">
                The buyer transfers the fiat currency (e.g. SINPE Móvil) directly to the seller&apos;s bank account and uploads the payment receipt.
              </p>
            </div>
            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-[#010308] border-2 border-[#BCED09] flex items-center justify-center text-[10px] font-black text-[#BCED09]">
                4
              </span>
              <h4 className="font-bold text-sm text-white">Smart Escrow Release</h4>
              <p className="text-gray-400 text-xs font-light mt-1">
                Once the seller receives the fiat, they confirm receipt, and the smart contract automatically releases the locked crypto to the buyer.
              </p>
            </div>
          </div>
        ) : (
          /* Detailed Guide (Deep walkthrough of architecture & execution) */
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#BCED09]">1. Onboarding & Connection</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                iKash uses a secure, non-custodial onboarding flow. Instead of registering with traditional credentials, you connect a Stellar-compatible wallet. This wallet generates cryptographic signatures locally on your device. To comply with local regulations and protect the P2P network, users complete a quick, biometric-based KYC verification session managed off-premises by Didit.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#BCED09]">2. Secure Smart Contract Fideicomiso (Escrow)</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                When a P2P trade is opened, a smart contract is deployed on the Stellar blockchain through the Trustless Work API. The seller funds this contract with the crypto assets. The assets are securely held in the contract. Neither the buyer, the seller, nor the iKash platform can access or withdraw these funds unilaterally while the contract is active.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#BCED09]">3. Direct Bank-to-Bank Settlement</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                The buyer transfers the required local fiat currency directly to the seller&apos;s registered bank account (using details configured in the seller&apos;s payment methods). No fiat funds flow through iKash. Once the transfer is done, the buyer uploads the transaction screenshot as evidence. This action logs a cryptographic hash of the transaction to the Stellar ledger, proving the transfer was completed.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#BCED09]">4. Non-Custodial Asset Release</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed">
                After verifying the bank transfer, the seller signs a cryptographic transaction using their wallet to approve the release of funds. The smart contract automatically executes and transfers the assets to the buyer&apos;s wallet address. In case of cooperation issues, either party can file a dispute, and a platform support key can act as a dispute resolver to release funds to the rightful owner based on the uploaded bank transfer proof.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
