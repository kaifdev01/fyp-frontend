'use client';
import { motion } from 'framer-motion';
import { Star, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const freelancers = [
    {
        name: "David Chen",
        role: "Full Stack Engineer",
        rating: "5.0",
        rate: "$85",
        skills: ["React", "Node.js", "AWS"],
        image: "https://i.pravatar.cc/150?u=david",
        verified: true
    },
    {
        name: "Sarah Miller",
        role: "Product Designer",
        rating: "4.9",
        rate: "$65",
        skills: ["UI/UX", "Figma", "Brand"],
        image: "https://i.pravatar.cc/150?u=sarah",
        verified: true
    },
    {
        name: "James Wilson",
        role: "AI Researcher",
        rating: "5.0",
        rate: "$120",
        skills: ["Python", "PyTorch", "NLP"],
        image: "https://i.pravatar.cc/150?u=james",
        verified: true
    },
    {
        name: "Emily Zhang",
        role: "SEO Strategist",
        rating: "4.8",
        rate: "$50",
        skills: ["SEO", "Content",],
        image: "https://i.pravatar.cc/150?u=emily",
        verified: true
    }
];

export default function TopFreelancers() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <p className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">Elite Talent</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Hire the <span className="text-blue-600">Top 1%</span>
                </h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors">
                View All Talent <ArrowRight size={20} />
            </button>
        </div>

        {/* Cards Grid - Switched to 4 columns for larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {freelancers.map((freelancer, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden flex flex-col items-center"
                >
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Image - Increased Size */}
                    <div className="relative w-32 h-32 mb-6 z-10">
                        <img 
                            src={freelancer.image} 
                            alt={freelancer.name} 
                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        {freelancer.verified && (
                            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Pro">
                                <ShieldCheck size={16} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center z-10 w-full">
                        <h3 className="font-bold text-gray-900 text-2xl mb-2">{freelancer.name}</h3>
                        <p className="text-base text-gray-500 font-medium mb-4">{freelancer.role}</p>
                        
                        {/* Rating & Rate Row */}
                        <div className="flex items-center justify-center gap-4 text-base mb-6">
                            <div className="flex items-center gap-1 font-bold text-gray-900 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                <Star size={16} className="text-yellow-500" fill="currentColor" />
                                {freelancer.rating}
                            </div>
                            <div className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {freelancer.rate}<span className="text-gray-400 font-normal text-xs">/hr</span>
                            </div>
                        </div>

                        {/* Skills - Only visible normally, slides away on hover to show button */}
                        <div className="flex flex-wrap justify-center gap-2 mb-2 group-hover:opacity-0 transition-opacity duration-200 absolute bottom-8 left-0 w-full px-6">
                            {freelancer.skills.map((skill, i) => (
                                <span key={i} className="text-xs uppercase tracking-wider font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        {/* "Hire Me" Button - Hidden normally, slides up on hover */}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-bold text-base shadow-xl shadow-blue-200 transform translate-y-24 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-6 left-6 right-6 w-[calc(100%-3rem)]">
                            View Profile
                        </button>
                    </div>

                    {/* Spacer to maintain height because of absolute positioning */}
                    <div className="h-10"></div>
                </motion.div>
            ))}
        </div>

        <div className="mt-12 text-center md:hidden">
             <button className="text-blue-600 font-bold flex items-center justify-center gap-2 mx-auto">
                View All Talent <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </section>
  );
}

