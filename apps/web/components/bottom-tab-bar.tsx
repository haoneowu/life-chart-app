'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomTabBar() {
    const pathname = usePathname();

    const tabs = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'History', path: '/history', icon: History },
        { name: 'Identity', path: '/profile', icon: User }, // Profile or Identity
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 px-4 flex items-center justify-around shadow-2xl shadow-teal-500/10">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className="relative py-2 px-4 flex flex-col items-center gap-1 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-teal-500/10 rounded-2xl border border-teal-500/20"
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            <span className={`text-[9px] font-mono uppercase tracking-widest ${isActive ? 'text-teal-400' : 'text-gray-600'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
