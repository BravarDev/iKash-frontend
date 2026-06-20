import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { OrderNavbar } from "./components/OrderNavbar";
import { TradeDashboard } from "./components/TradeDashboard";
import { OrdersSummaryBox } from "./components/OrdersSummaryBox";

export default function p2pPage() {
    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex flex-col min-w-0 flex-1">
                <Header description="trading floor" title="p2p marketplace" />
                <OrderNavbar />
                <main className="flex-1 pt-0 flex xl:gap-4">
                    <div className="w-full xl:w-[70%] px-8 h-full">
                        <TradeDashboard />
                    </div>
                    
                    <div className="hidden xl:block w-px bg-[#1F2937] h-full shrink-0" />
                    <div className="hidden xl:flex w-[30%] pt-8 px-8 flex-col gap-6 shrink-0">
                        <OrdersSummaryBox />
                    </div>
                </main>
            </div>
        </div>
    );
}