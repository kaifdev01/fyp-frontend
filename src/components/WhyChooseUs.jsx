'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Award, Star } from 'lucide-react';
import Image from 'next/image';

const features = [
    {
        title: "Top 1% Talent",
        description: "We rigorously vet every freelancer. You only work with the proven best.",
        icon: <Award className="text-yellow-400" size={24} />
    },
    {
        title: "Money Back Guarantee",
        description: "Not satisfied? Get a full refund. Your payment is held in escrow until you approve.",
        icon: <Shield className="text-green-400" size={24} />
    },
    {
        title: "Hire in Minutes",
        description: "Skip the applications. Our AI matches you with the perfect expert instantly.",
        icon: <Zap className="text-blue-400" size={24} />
    }
];

// Mock data for the carousel
const freelancers = [
    { name: "Sarah J.", role: "UX Designer", rating: "5.0", color: "bg-pink-500" },
    { name: "Michael C.", role: "React Dev", rating: "4.9", color: "bg-blue-500" },
    { name: "Jessica L.", role: "Copywriter", rating: "5.0", color: "bg-purple-500" },
    { name: "David K.", role: "SEO Expert", rating: "4.8", color: "bg-green-500" },
    { name: "Emily R.", role: "Illustrator", rating: "5.0", color: "bg-orange-500" },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-blue-300 font-semibold text-sm mb-6 border border-white/5">
                            ✨ The Smart Choice
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Hire the best,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Forget the rest.</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-md">
                            Experience a hiring process that's actually enjoyable. Quality, speed, and security—all in one place.
                        </p>

                        <div className="space-y-8">
                            {features.map((feature, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm lg:text-base">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Infinite Carousel Visual */}
                    <div className="relative h-[600px] w-full hidden lg:block overflow-hidden mask-linear-gradient">
                         {/* Vertical marquee effect */}
                         <div className="absolute inset-0">
                             {/* Gradient Masks for smooth fade in/out */}
                             <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-900 to-transparent z-20"></div>
                             <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent z-20"></div>

                             <motion.div 
                                animate={{ y: ["0%", "-50%"] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="flex flex-col gap-6 w-80 mx-auto"
                             >
                                {/* 
                                   We need the content to be taller than the container (600px) 
                                   AND we need two identical sets for the loop. 
                                   Base list (5 items) ~500px might be too short. 
                                   Let's double the base list to make 'one set' ~1000px.
                                   Then we render that set TWICE for the 0% -> -50% loop.
                                */}
                                {[...freelancers, ...freelancers, ...freelancers, ...freelancers].map((freelancer, idx) => (
                                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                                        <div className={`w-12 h-12 rounded-full ${freelancer.color} flex items-center justify-center text-white font-bold`}>
                                            {freelancer.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{freelancer.name}</h4>
                                            <p className="text-sm text-gray-400">{freelancer.role}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                            <Star size={14} fill="currentColor" /> {freelancer.rating}
                                        </div>
                                    </div>
                                ))}
                             </motion.div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
