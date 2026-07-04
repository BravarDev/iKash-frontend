"use client";

import { useState } from "react";
import { ShieldCheck, Lock, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";

export default function PlatformSecurityPage() {
  const [isDetailed, setIsDetailed] = useState(false);

  return (
    <div className="space-y-8 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ffffff08] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#BCED09]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Ecosystem Security
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

      {/* Intro Security Notice */}
      <div className="p-6 rounded-2xl bg-[#BCED09]/5 border border-[#BCED09]/20 flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-[#BCED09] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-white">Audited & Non-Custodial</h4>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            iKash&apos;s smart contracts are powered by Trustless Work protocols, which have undergone rigorous security audits. Your funds are secured by the decentralized Stellar ledger.
          </p>
        </div>
      </div>

      {/* Security Pillars */}
      <div className="space-y-8">
        {/* Non-Custodial Design */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#BCED09]" />
            <h3 className="font-bold text-white text-lg">Zero-Custody Architecture</h3>
          </div>
          {!isDetailed ? (
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              We never ask for, access, or store your private keys, seed phrases, or credentials. Your wallet acts as your exclusive key to authorize transactions locally. iKash cannot block, touch, or freeze your digital assets.
            </p>
          ) : (
            <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
              <p>
                In a typical centralized exchange, users deposit assets into the exchange&apos;s wallets. This exposes users to platform insolvencies, internal fraud, or security breaches.
              </p>
              <p>
                iKash implements a **Zero-Custody model**. When you connect your wallet, all operations are authenticated and signed directly on your device. The frontend builds a transaction envelope (XDR), which your browser extension signs. This signature is broadcasted to the decentralized Stellar network. Our servers only record and display on-chain events, guaranteeing you retain full control over your assets.
              </p>
            </div>
          )}
        </div>

        {/* Didit KYC Verification */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <EyeOff className="w-5 h-5 text-[#BCED09]" />
            <h3 className="font-bold text-white text-lg">Didit Identity & KYC Privacy</h3>
          </div>
          {!isDetailed ? (
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Didit performs user identity checks safely off-premises. iKash never stores your biometric scans, passport photos, or personal files on our servers. We comply with GDPR guidelines to guarantee absolute user privacy.
            </p>
          ) : (
            <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
              <p>
                To maintain a safe, fraud-free peer-to-peer ecosystem, iKash mandates KYC verification for traders. However, storing identity documents creates a massive security liability.
              </p>
              <p>
                iKash solves this by integrating **Didit**, a decentralized identity and verification platform. The verification process runs entirely in Didit&apos;s secure sandbox. After completion, Didit sends a cryptographic token indicating a status update (Approved or Rejected). iKash only stores this status flag (`kycStatus`). Your raw biometric data, documents, and private details never touch iKash servers, protecting you against leaks and identity theft.
              </p>
            </div>
          )}
        </div>

        {/* Audited Trustless Work Escrows */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#BCED09]" />
            <h3 className="font-bold text-white text-lg">Trustless Work Escrow Security</h3>
          </div>
          {!isDetailed ? (
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Escrows are deployed using audited smart contracts on Stellar. Trustless Work&apos;s multi-release system prevents unilateral withdrawals. Support mediation keys serve only to resolve disputed trades based on proof.
            </p>
          ) : (
            <div className="space-y-2 text-gray-400 text-xs font-light leading-relaxed">
              <p>
                iKash&apos;s smart escrow contracts are powered by **Trustless Work**, a developer platform that deploys audited milestone and multi-release Soroban contracts on the Stellar network.
              </p>
              <p>
                The contract code is public, open-source, and immutable on-chain. When a buyer funds an escrow, the contract guarantees that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-gray-400 font-light">
                <li>The seller cannot run away with the crypto once it is funded.</li>
                <li>The buyer cannot extract the crypto without sending the local fiat bank transfer first.</li>
                <li>Disputes are mediated by a designated support key that arbitrates based on the cryptographic hash of the bank transfer evidence.</li>
              </ul>
              <p>
                This ensures a mathematically secure framework that prevents theft and scam attempts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Safety Best Practices Notice */}
      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4 mt-6">
        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-white">Security Best Practices</h4>
          <ul className="list-disc list-inside text-gray-400 text-xs font-light space-y-1 leading-normal">
            <li>Never share your wallet seed phrase or private keys with anyone, including iKash staff.</li>
            <li>Double-check bank beneficiary names and transfer amounts before finalizing a bank transfer.</li>
            <li>Always upload the bank confirmation receipt directly in the order chat. Do not trade outside iKash&apos;s escrow system.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
