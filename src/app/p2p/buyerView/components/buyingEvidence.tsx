export function BuyingEvidence() {
    return (
        <div className="bg-[#161618] w-100.5 h-120 mt-40 rounded-2xl">
            <div className="flex items-center justify-center px-4 py-5">
                <div className="bg-[#1B1B21] border border-[#4549324D] w-92.5 h-24.75 rounded-lg p-5">
                    <p className="text-[#C2C7D0] text-[12px]">
                        Ensure the payment receipt clearly shows the destination IBAN and
                        transaction reference. Operations are monitored 24/7 for security.
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button type="button" className="bg-[#DAFF00] w-92.5 h-12 text-[#2B3400] font-bold py-2 px-4 rounded-lg hover:bg-[#c2e500] uppercase">
                    Upload Evidence
                </button>
            </div>
            <div className="border border-[#8F8389CC] w-92.5 h-40 m-4 flex flex-col items-center justify-center">
                <p className="text-[16px] font-medium text-[#8F8389CC]">Drop your evidence</p>
                <p className="text-[16px] font-medium text-[#8F8389CC]">file here</p>
            </div>
            <div className="flex items-center justify-center">
                <button type="button" className="bg-[#2A292F] w-92.5 h-12 text-[#FFFFFF] font-bold py-2 px-4 rounded-lg hover:bg-[#1f1e24] uppercase">
                    MARK AS PAID
                </button>
            </div>
        </div>
    );
}