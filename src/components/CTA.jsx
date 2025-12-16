'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-12 md:p-20 overflow-hidden text-center shadow-2xl"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to turn your ideas<br />into reality?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Join our community of expert freelancers and innovative businesses. Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                >
                  Get Started Now <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link href="/freelancers">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Browse Talent
                </motion.button>
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm mt-8">No credit card required for sign up</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
