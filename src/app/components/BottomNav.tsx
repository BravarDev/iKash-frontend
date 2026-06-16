'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@/features/wallet'
import { useUser } from '@/features/user/presentation/context/UserContext'
import { LayoutGrid, ArrowLeftRight, Database, Settings } from 'lucide-react';

const links = [
    { href: '/dashboard', label: 'Home', icon: LayoutGrid, selected: '/home-selected-icon.svg' },
    { href: '/p2p', label: 'P2P', icon: ArrowLeftRight, selected: '/p2p-selected-icon.svg' },
    { href: '/transactions', label: 'Transactions', icon: Database, selected: '/transaction-selected-icon.svg' },
    { href: '/settings', label: 'Settings', icon: Settings, selected: '' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#343434] border-t border-[#1F2937] z-50">
            <div className="flex items-center justify-around py-3">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const IconComponent = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-200 ease-in-out
                            ${isActive
                                ? 'text-[#BCED09] font-semibold'
                                : 'text-[#8F8389] font-medium hover:text-white'
                            }`}
                        >
                            <IconComponent 
                                size={20} 
                                strokeWidth={isActive ? 2.5 : 2} 
                            />
                            <span className='text-[10px]'>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    )
}
