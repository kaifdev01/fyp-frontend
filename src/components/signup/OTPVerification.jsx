'use client';
import { motion } from 'framer-motion';

export default function OTPVerification({ 
  otp, 
  handleOtpChange, 
  handleOtpSubmit, 
  loading, 
  resendTimer, 
  handleResendOTP, 
  onBack 
}) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleOtpSubmit} className="space-y-8">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.some((digit) => !digit)}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          ← Back
        </button>
        <p className="text-sm text-gray-600">
          Did not receive code?
          <button
            onClick={handleResendOTP}
            disabled={resendTimer > 0 || loading}
            className="text-blue-600 hover:underline font-bold disabled:opacity-50 disabled:cursor-not-allowed ml-1"
          >
            {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
          </button>
        </p>
      </div>
    </motion.div>
  );
}
