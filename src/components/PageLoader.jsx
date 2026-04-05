"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader immediately
    setLoading(true);
    
    // Hide after a short delay to show the transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  // Listen for link clicks globally
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.href && !target.target && target.href.startsWith(window.location.origin)) {
        setLoading(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
              <div className="absolute inset-0 w-14 h-14 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
            <p className="text-gray-700 font-semibold text-lg">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
