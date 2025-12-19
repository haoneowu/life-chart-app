'use client';

import { motion } from 'framer-motion';

export function CosmicLoader() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black">
            <div className="relative w-32 h-32">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 border-2 border-teal-500/20 rounded-full"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                {/* Middle Ring */}
                <motion.div
                    className="absolute inset-4 border-2 border-rose-500/30 rounded-full"
                    animate={{ rotate: -360, scale: [1, 0.9, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner Momentum Bars */}
                <div className="absolute inset-10 flex items-center justify-center gap-1">
                    {[0.4, 0.7, 1.0, 0.7, 0.4].map((h, i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 bg-teal-400 rounded-full"
                            style={{ height: `${h * 100}%` }}
                            animate={{
                                height: [`${h * 80}%`, `${h * 120}%`, `${h * 80}%`],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center space-y-2"
            >
                <p className="text-xs font-mono text-teal-500 uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing Momentum
                </p>
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Reading celestial signals...
                </p>
            </motion.div>
        </div>
    );
}
