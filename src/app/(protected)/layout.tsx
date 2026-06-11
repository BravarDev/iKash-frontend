"use client";

import { useWallet } from "@/features/wallet";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, isLoading: walletLoading } = useWallet();
  const { accessToken, currentUser, isLoading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = walletLoading || userLoading;
  const isSetupRoute = pathname === "/setupAccount";

  useEffect(() => {
    if (isLoading) return;

    if (!isConnected) {
      router.replace("/welcome");
      return;
    }

    if (!accessToken) {
      router.replace("/welcome");
      return;
    }

    if (currentUser?.pendingAccountInfo && !isSetupRoute) {
      router.replace("/setupAccount");
    }
  }, [isConnected, isLoading, accessToken, currentUser, router, isSetupRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#010308]">
        <div className="w-8 h-8 border-4 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isConnected || !accessToken) return null;

  return <>{children}</>;
}
