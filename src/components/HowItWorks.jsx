'use client';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-gray-500 text-lg">
                Get your project done in three simple steps. We make hiring tailored experts safe, easy, and efficient.
            </p>
        </div>

        {/* Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            
            {/* SVG Connector (Desktop Only) - Animated Drawing Line */}
            <div className="absolute top-[80px] left-0 w-full hidden md:block -z-10 opacity-60">
                <svg className="w-full" height="120" viewBox="0 0 1000 120" preserveAspectRatio="none">
                    <motion.path 
                        d="M 150 60 Q 300 10, 500 60 T 850 60"
                        fill="none"
                        stroke="#9ca3af" 
                        strokeWidth="3"  
                        strokeDasharray="12 12" 
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Step 1: Post a Job */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group relative"
            >
                {/* Number Badge 1 - Pop In */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -left-2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-lg z-20"
                >1</motion.div>

                {/* Visual: Job Post UI Mockup - Floating Animation */}
                <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-32 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 mb-8 relative z-10 flex flex-col justify-center gap-2"
                >
                    <div className="w-2/3 h-2 bg-gray-100 rounded-full mb-1"></div>
                    <div className="w-full h-2 bg-gray-50 rounded-full"></div>
                    <div className="w-full h-2 bg-gray-50 rounded-full"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-[#1f2937] text-white p-2 rounded-lg shadow-lg flex items-center gap-2">
                         <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                         <span className="text-[10px] font-bold">New Job</span>
                    </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Post A Job</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Simply describe your project. It’s free and helps us find the right talent for you instantly.
                </p>
            </motion.div>

            {/* Step 2: Choose Freelancers */}
            <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center group mt-0 md:mt-12 relative"
            >
                 {/* Number Badge 2 */}
                 <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -left-2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-lg z-20"
                >2</motion.div>

                 {/* Visual: Profile Selection Mockup */}
                 <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="w-48 h-32 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 mb-8 relative z-10 flex flex-col gap-3 justify-center"
                >
                    {/* Mock Bars */}
                    <div className="flex items-end justify-center gap-2 h-16 pointer-events-none">
                        <div className="w-3 h-8 bg-blue-100 rounded-t-sm"></div>
                        <div className="w-3 h-12 bg-blue-500 rounded-t-sm"></div>
                        <div className="w-3 h-6 bg-blue-200 rounded-t-sm"></div>
                        <div className="w-3 h-10 bg-blue-300 rounded-t-sm"></div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute -top-4 -right-2 bg-pink-100 text-pink-600 p-2 rounded-lg shadow-sm">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Experts</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Browse profiles, reviews, and proposals. Interview your favorites and hire the best fit.
                </p>
            </motion.div>

            {/* Step 3: Pay Safely */}
            <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8, duration: 0.5 }}
                 viewport={{ once: true }}
                 className="flex flex-col items-center text-center group relative"
            >
                 {/* Number Badge 3 */}
                 <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.9 }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -left-2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-lg z-20"
                >3</motion.div>

                 {/* Visual: Payment Mockup */}
                 <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="w-48 h-32 bg-[#1f2937] border border-gray-700 shadow-xl rounded-2xl p-4 mb-8 relative z-10 flex flex-col text-white"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-[10px] text-gray-400">Escrow</div>
                        <div className="w-4 h-4 rounded-full bg-white/20"></div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Total</div>
                        <div className="text-xl font-bold">$1,200</div>
                    </div>

                    <div className="absolute top-1/2 -right-6 bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg text-xs font-bold">+ Add New</div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pay Safely</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Uses our secure escrow system. Track spending and only release funds when you're 100% happy.
                </p>
            </motion.div>

        </div>
      </div>
    </section>
  );
}
