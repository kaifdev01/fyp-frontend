'use client';
import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function RoleSelection({ userType, setUserType, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div
          onClick={() => setUserType("freelancer")}
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
            userType === "freelancer"
              ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
              : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
          }`}
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">I am a freelancer</h3>
            <p className="text-sm text-gray-500">Looking for work</p>
          </div>
        </div>

        <div
          onClick={() => setUserType("client")}
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
            userType === "client"
              ? "border-green-500 bg-green-50/50 shadow-md ring-2 ring-green-500/20"
              : "border-gray-200 hover:border-green-300 hover:shadow-sm"
          }`}
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">I am a client</h3>
            <p className="text-sm text-gray-500">Hiring for a project</p>
          </div>
        </div>
      </div>

      {userType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
          >
            Continue as {userType === "freelancer" ? "Freelancer" : "Client"}
          </button>
        </motion.div>
      )}

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline font-bold"
        >
          Log In
        </Link>
      </p>
    </motion.div>
  );
}
