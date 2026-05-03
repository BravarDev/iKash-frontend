export interface BuyingDetailsProps {
    amount: number;
    unitPrice: number;
    total: number;
    paymentMethod: string
}

export function BuyingDetails({ amount, unitPrice, total, paymentMethod }: BuyingDetailsProps) {
    return (
        <div className="bg-[#161618] w-154 h-120 border-l-4 border-[#DAFF00] rounded-tr-xl rounded-br-xl">
            <div className="grid grid-cols-2">
                <div className="m-8">
                    <p className="text-[#C2C7D0] text-[12px] uppercase">
                        OPERATION TYPE
                    </p>
                    <h2 className="text-white font-bold text-3xl">BUYING</h2>
                </div>
                <div className="justify-items-end m-8">
                    <p className="text-[#C2C7D0] text-[12px] uppercase">
                        ASSET AMOUNT
                    </p>
                    <h2 className="text-[#DAFF00] font-bold text-3xl">{amount} XLM</h2>
                </div>
            </div>
            <div className="flex flex-col ml-8">
                <div>
                    <p className="text-[#8F9378] text-[10px] font-bold mb-3 uppercase">unit price</p>
                    <input type="text" className="bg-[#0E0E13] w-137 h-15.5 pl-2 font-bold focus:outline-none" value={`${unitPrice}`} readOnly />
                </div>
                <div className="mt-4">
                    <p className="text-[#8F9378] text-[10px] font-bold mb-3 uppercase">total asset value</p>
                    <input type="text" className="bg-[#0E0E13] w-137 h-15.5 pl-2 font-bold focus:outline-none" value={`${total}`} readOnly />
                </div>
                <div className="mt-4">
                    <p className="text-[#8F9378] text-[14px] font-medium mb-3 uppercase">payment method</p>
                    <input type="text" className="bg-[#1F1F25] w-137 h-15.5 pl-2 font-bold focus:outline-none" value={`${paymentMethod}`} readOnly />
                </div>
            </div>
        </div>
    );
}