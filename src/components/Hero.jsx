'use client';

import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-70px)] bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden flex items-center justify-center mt-12">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 -z-10 opacity-30">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[500px] h-[500px] bg-blue-300 rounded-full blur-[100px]"
                />
            </div>
            <div className="absolute bottom-0 left-0 -z-10 opacity-30">
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-[600px] h-[600px] bg-purple-300 rounded-full blur-[120px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm border border-blue-100 rounded-full text-blue-600 font-semibold text-sm shadow-sm"
                            >
                                🚀 The World's #1 Freelance Marketplace
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-gray-900 tracking-tight">
                                Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ideas</span> Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Reality</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                                Connect with top-tier talent for any project. From web development to design, we have the experts you need.
                            </p>
                        </div>

                        {/* Glassmorphism Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full max-w-xl"
                        >
                            <div className="p-2 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="What service are you looking for?"
                                        className="w-full h-12 pl-12 pr-4 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group">
                                    Search
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Popular Tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-3"
                        >
                            <span className="text-sm font-semibold text-gray-500 mr-2">Popular:</span>
                            {['Web Design', 'React JS', 'Logo Design', 'AI Services'].map((tag, i) => (
                                <button
                                    key={tag}
                                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    {tag}
                                </button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Image/Graphic area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full flex items-center lg:items-end justify-center lg:justify-end mt-8 lg:mt-0"
                    >
                        <div className="relative w-full max-w-[500px] lg:max-w-[800px] aspect-square lg:-mb-10">
                            {/* Main Hero Image */}
                            <div className="absolute inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full animate-blob filter blur-3xl opacity-50"></div>
                            <Image
                                src="/hero-img.png"
                                alt="Freelancer at work"
                                // fill
                                width={475}
                                height={475}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain object-bottom drop-shadow-2xl z-10 -mb-20 sm:mb-0"
                                priority
                            />

                            {/* Floating Cards - Responsive Positioning */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 -left-2 sm:top-20 sm:-left-6 z-20 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-3 max-w-[160px] sm:max-w-none"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm sm:text-base">✓</div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Project Completed</p>
                                    <p className="text-xs sm:text-sm font-bold text-gray-800">Website Redesign</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-10 -right-2 sm:bottom-40 sm:-right-4 z-20 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-3"
                            >
                                <div className="flex -space-x-2 sm:-space-x-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500 border-2 border-white"></div>
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-gray-800">10k+ Freelancers</p>
                                    <div className="flex text-yellow-500 text-[10px] sm:text-xs">★★★★★</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
