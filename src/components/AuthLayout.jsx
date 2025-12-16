'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Content - Desktop Only */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 z-0">
                    {/* Abstract Background pattern */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-lg space-y-8">
                    <Link href="/" className="inline-block mb-8">
                        <span className="text-3xl font-bold tracking-tight">WorkDeck.</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold leading-tight mb-6">
                            Join the world's most trusted freelance community.
                        </h2>
                        <p className="text-lg opacity-90 leading-relaxed mb-8">
                            "WorkDeck helped us scale our design team in days, not months. The talent quality is unmatched."
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                                SJ
                            </div>
                            <div>
                                <p className="font-bold">Sarah Jenkins</p>
                                <p className="text-sm opacity-80">CTO, TechStart Inc.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Content - Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-12 lg:p-16 relative">
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="text-xl font-bold text-blue-600">WorkDeck.</Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-gray-600">{subtitle}</p>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
}
