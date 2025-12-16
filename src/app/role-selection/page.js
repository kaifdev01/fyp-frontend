'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2 } from 'lucide-react';
import Header from '../../components/Header';

export default function RoleSelection() {
  const router = useRouter();
  const [userType, setUserType] = useState('');
  
  // Check for pre-selected role from signup
  useEffect(() => {
    const preSelected = localStorage.getItem('preSelectedRole');
    if (preSelected) {
      setUserType(preSelected);
      localStorage.removeItem('preSelectedRole');
    }
  }, []);

  const handleContinue = () => {
    if (!userType) return;
    
    const email = localStorage.getItem('oauthEmail');
    localStorage.setItem('userEmail', email);
    localStorage.removeItem('oauthEmail');
    localStorage.removeItem('oauthName');
    
    if (userType === 'client') {
      router.push('/complete-profile');
    } else {
      router.push('/freelancer-profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-center mb-3">Join as a freelancer or client</h1>
            <p className="text-gray-600 text-center mb-10">Choose how you want to use WorkDeck</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div
                onClick={() => setUserType('freelancer')}
                className={`border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                  userType === 'freelancer' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">I'm a freelancer</h3>
                  <p className="text-gray-600">Looking for work</p>
                </div>
              </div>

              <div
                onClick={() => setUserType('client')}
                className={`border-2 rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                  userType === 'client' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="text-green-600" size={28} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">I'm a client</h3>
                  <p className="text-gray-600">Hiring for a project</p>
                </div>
              </div>
            </div>

            {userType && (
              <div className="text-center">
                <button
                  onClick={handleContinue}
                  className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}