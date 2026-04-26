type ChatProps = {
    chatName: string;
}

export const Chat = ({ chatName }: ChatProps) => {
    return (
        <div className="w-115 h-246 bg-[#1B1B21]">
            <header className="flex gap-3 h-16 border-b border-[#4549321A]">
                <div className="w-9 h-9 bg-[#35343A] border border-[#4549324D] rounded-xs ml-4 mt-4 flex items-center justify-center">
                    <p className="text-[8px]">Perfil</p>
                </div>
                <div className="flex flex-col mt-4">
                    <p className="text-white font-bold text-[12px]">{chatName}</p>
                    <p className="text-[10px] text-[#C2C7D0]">Typically replies in 2m</p>
                </div>
            </header>
            <main className="h-190 mt-4 border-b border-[#d1f80d1a]">
                <section className="flex items-center justify-center">
                    <div className="bg-[#1F1F25] w-30.75 h-5.25 items-center justify-center flex rounded-2xl">
                        <p className="uppercase text-[10px] text-[#8F9378]">order created</p>
                    </div>
                </section>
                <div className="mt-5 flex items-center justify-center">
                    <h1>Mensajes</h1>
                </div>
            </main>
            <footer className="h-33">
                <section className="flex items-center justify-center pt-7">
                    <input type="text" className="bg-[#0E0E13] w-100 h-15.5 pl-2 focus:outline-none" placeholder="Type a message..." />
                </section>
            </footer>
        </div>
    );
}