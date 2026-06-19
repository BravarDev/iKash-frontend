'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { useWallet } from '@/features/wallet'
import { useUser } from '@/features/user/presentation/context/UserContext'
import { LayoutGrid, ArrowLeftRight, Database, Settings } from 'lucide-react'

const navLinks = [
    { href: '/dashboard', label: 'Home', icon: LayoutGrid },
    { href: '/p2p', label: 'P2P', icon: ArrowLeftRight },
    { href: '/transactions', label: 'Transactions', icon: Database },
]

export function Aside() {
    const pathname = usePathname()
    const router = useRouter()
    const { disconnect } = useWallet()
    const { setCurrentUser, setAccessToken } = useUser()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        disconnect()
        setCurrentUser(null)
        setAccessToken(null)
        router.push('/')
    }

    return (
        <>
            {/* Desktop sidebar — unchanged */}
            <aside className="hidden md:flex w-[288px] sticky top-0 h-screen self-start shrink-0 overflow-y-auto bg-[#343434] flex-col p-8">
                <div className="pl-3 pt-4">
                    <Image src='/iKash.svg' width={80} height={30} alt='iKash logo' />
                </div>

                <nav className="flex flex-col gap-7.5 pt-20">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        const IconComponent = link.icon
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
                                ${isActive ? 'text-[#BCED09] font-semibold' : 'text-[#8F8389] font-medium hover:bg-[#161618] hover:text-white'}`}
                            >
                                <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className='text-[18px]'>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 pb-5">
                    <div className="border-t border-gray-700 mb-2" />
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out ${
                            pathname.startsWith('/settings') ? 'text-[#BCED09] font-semibold' : 'text-[#8F8389] font-medium hover:bg-[#161618] hover:text-white'
                        }`}
                    >
                        <Settings size={18} strokeWidth={pathname.startsWith('/settings') ? 2.5 : 2} />
                        <span className='text-[18px]'>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#8F8389] cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#161618] hover:text-white"
                    >
                        <Image src='/logout-icon.svg' width={20} height={20} alt='logout' />
                        <span className='text-[18px]'>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile header — hamburger / menu toggle */}
            <div
                className="md:hidden fixed top-0 left-0 right-0 z-50 px-5 pt-5 pb-6 transition-colors duration-200"
                style={{ background: menuOpen ? '#000000' : 'transparent' }}
            >
                {!menuOpen ? (
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="flex flex-col gap-[5px] p-2"
                        aria-label="Open menu"
                    >
                        <span className="block w-5 h-[2px] bg-white" />
                        <span className="block w-5 h-[2px] bg-white" />
                        <span className="block w-5 h-[2px] bg-white" />
                    </button>
                ) : (
                    <div className="flex flex-col gap-5">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="text-left text-[#BCED09] text-base font-bold tracking-widest uppercase"
                            aria-label="Close menu"
                        >
                            Menu
                        </button>
                        <Link
                            href="/settings"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 text-white text-[17px] hover:text-[#BCED09] transition-colors"
                        >
                            <Settings size={24} strokeWidth={2} />
                            Settings
                        </Link>
                        <button
                            onClick={() => { setMenuOpen(false); handleLogout() }}
                            className="flex items-center gap-3 text-white text-[17px] hover:text-[#BCED09] transition-colors"
                        >
                            <Image src='/logout-icon.svg' width={24} height={24} alt='logout' />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Full-page blur overlay, sits below the menu panel, fades the rest of the page */}
            {menuOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 transition-opacity duration-200"
                    onClick={() => setMenuOpen(false)}
                    style={{
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        background: 'rgba(0,0,0,0.35)',
                    }}
                />
            )}

            {/* Mobile bottom navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
                <div className="relative w-full" style={{ height: '70px' }}>
                    {/* SVG bar with dynamic notch */}
                    <svg
                        viewBox="0 0 375 70"
                        preserveAspectRatio="none"
                        className="absolute inset-0 w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {(() => {
                            const activeIndex = navLinks.findIndex(l => pathname === l.href)
                            const totalLinks = navLinks.length
                            const slotWidth = 375 / totalLinks
                            const cx = activeIndex >= 0 ? slotWidth * activeIndex + slotWidth / 2 : -999
                            const r = 32
                            const notchDepth = 22

                            const path = activeIndex >= 0
                                ? `M0,0 
                                   L${cx - r - 15},0 
                                   Q${cx - r - 5},0 ${cx - r},${notchDepth * 0.4}
                                   Q${cx - r * 0.5},${notchDepth} ${cx},${notchDepth}
                                   Q${cx + r * 0.5},${notchDepth} ${cx + r},${notchDepth * 0.4}
                                   Q${cx + r + 5},0 ${cx + r + 15},0
                                   L375,0 L375,70 L0,70 Z`
                                : `M0,0 L375,0 L375,70 L0,70 Z`

                            return <path d={path} fill="#0e0e0e" />
                        })()}
                    </svg>

                    {/* Nav icons */}
                    <div className="absolute inset-0 flex items-center">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            const IconComponent = link.icon
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex-1 flex flex-col items-center justify-center"
                                    aria-label={link.label}
                                >
                                    {isActive ? (
                                        <div className="flex flex-col items-center" style={{ transform: 'translateY(-14px)' }}>
                                            <div
                                                className="flex items-center justify-center rounded-full bg-[#BCED09]"
                                                style={{ width: '52px', height: '52px' }}
                                            >
                                                <IconComponent size={24} strokeWidth={2.5} color="#000000" />
                                            </div>
                                            <span className="text-[10px] text-white tracking-wide mt-1">
                                                {link.label}
                                            </span>
                                        </div>
                                    ) : (
                                        <IconComponent size={22} strokeWidth={2} color="#8F8389" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}