'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Chrome } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                >
                    {/* Background Gradient */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-white to-rose-500 opacity-50" />

                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Join the Cosmos'}
                            </h2>
                            <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">
                                Unlock your complete chart history
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 py-4 border border-zinc-200 rounded-2xl bg-white hover:bg-gray-50 transition-all font-bold text-zinc-900 shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            <div className="relative flex items-center gap-4 py-2">
                                <div className="flex-1 h-[1px] bg-white/10" />
                                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">OR</span>
                                <div className="flex-1 h-[1px] bg-white/10" />
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Email Address"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Password"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-teal-500/50 transition-colors"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-xs text-rose-400 font-medium text-center">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-teal-500 text-white rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Authenticating...' : isLogin ? 'Login' : 'Create Account'}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-white font-bold hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
