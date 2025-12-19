'use client';

import { motion } from 'framer-motion';
import { User, Shield, Key, Bell } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-black p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Cosmic Identity
                    </h1>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Manage your personal signature and session</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                                <User className="w-6 h-6 text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Guest User</h3>
                                <p className="text-xs text-gray-500 font-mono">Anonymous Session</p>
                            </div>
                        </div>
                        <button className="w-full py-4 rounded-2xl bg-teal-500 text-black font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform">
                            Connect Full Profile
                        </button>
                    </div>

                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-300">Privacy Mode</span>
                            </div>
                            <div className="w-10 h-5 bg-teal-500/20 rounded-full flex items-center px-1 border border-teal-500/30">
                                <div className="w-3 h-3 bg-teal-400 rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-300">Push Notifications</span>
                            </div>
                            <div className="w-10 h-5 bg-white/10 rounded-full flex items-center px-1 border border-white/10">
                                <div className="w-3 h-3 bg-gray-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
