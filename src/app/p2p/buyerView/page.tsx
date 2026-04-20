import { Aside } from "@/app/components/Aside";
import { Header } from "@/app/components/Header";
import { BuyingDetails } from "./components/buyingDetails";
import { BuyingEvidence } from "./components/buyingEvidence";

export default function BuyerView() {
    return (
        <div className="flex min-h-screen w-full">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header description="trading floor" title="p2p marketplace" />
                <main className="flex items-center justify-start gap-5 pl-12">
                    <BuyingDetails amount={1243.54} unitPrice={0.1245} total={154.82} paymentMethod={"Bank Transfer SEPA"} />
                    <BuyingEvidence />
                </main>
            </div>
        </div>
    );
}