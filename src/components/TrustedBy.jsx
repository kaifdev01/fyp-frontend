'use client';
import { motion } from 'framer-motion';

const companies = [
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
  { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
];

export default function TrustedBy() {
  return (
    <section className="py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-gray-500 font-medium">Trusted by leading companies worldwide</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...companies, ...companies, ...companies].map((company, index) => (
            <div key={index} className="mx-12 flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
               {/* Using text for now as we don't have local SVG assets, but the structure supports images */}
               {/* <img src={company.logo} alt={company.name} className="h-8 w-auto object-contain" /> */}
               <span className="text-2xl font-bold text-gray-400 hover:text-gray-800 cursor-default">{company.name}</span>
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
           {[...companies, ...companies, ...companies].map((company, index) => (
            <div key={index} className="mx-12 flex items-center justify-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
               <span className="text-2xl font-bold text-gray-400 hover:text-gray-800 cursor-default">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tailwind config needs to have 'extends: { animation: { marquee: ... } }' for this to work perfectly without framer motion for the loop, 
          BUT since I promised framer motion, let's do a framer motion version instead which is smoother and doesn't require tailwind config changes. */}
    </section>
  );
}

// Re-writing with Framer Motion for better control and no config dependency
export function TrustedByFramer() {
    return (
        <section className="py-10 bg-white overflow-hidden border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Trusted by Global Leaders</p>
            </div>

            <div className="flex">
                <motion.div
                    className="flex flex-shrink-0 items-center space-x-20 pr-20"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {[...companies, ...companies, ...companies, ...companies].map((company, idx) => (
                         <div key={idx} className="flex items-center justify-center group cursor-pointer">
                            <span className="text-2xl sm:text-3xl font-bold text-gray-300 group-hover:text-blue-600 transition-colors duration-300">
                                {company.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
