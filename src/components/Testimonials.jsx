'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Alex Thompson",
        role: "CEO, TechStart",
        content: "The quality of freelancers on this platform is unmatched. We built our MVP in record time.",
        image: "https://i.pravatar.cc/150?u=alex",
        rating: 5
    },
    {
        name: "Sarah Chen",
        role: "Marketing Director",
        content: "I was skeptical about hiring online, but the vetting process here is a game changer. Highly recommend!",
        image: "https://i.pravatar.cc/150?u=sarah",
        rating: 5
    },
    {
        name: "James Wilson",
        role: "Startup Founder",
        content: "Found an amazing developer within 2 hours. The escrow system gave me total peace of mind.",
        image: "https://i.pravatar.cc/150?u=james",
        rating: 5
    },
    {
        name: "Emily Rodriguez",
        role: "Creative Director",
        content: "As a designer, I love how easy it is to communicate with clients. The interface is beautiful.",
        image: "https://i.pravatar.cc/150?u=emily",
        rating: 4.9
    },
    {
        name: "Michael Chang",
        role: "E-commerce Owner",
        content: "Scalability was our biggest issue. This platform helped us build a remote team in days.",
        image: "https://i.pravatar.cc/150?u=michael",
        rating: 5
    }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden relative">
      {/* Add CSS for the scroll animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Loved by thousands</h2>
        <p className="text-xl text-gray-400">See what our community has to say about their experience</p>
      </div>

      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

        <div className="flex overflow-hidden">
            {/* 
                Refactored to CSS animation for "pause on hover" support.
                The animation moves from 0% to -50% of the content width.
            */}
            <div
                className="flex gap-8 px-4 animate-scroll w-max"
            >
                {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                    <motion.div 
                        key={index}
                        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.1)" }} 
                        className="w-[350px] flex-shrink-0 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 transition-colors duration-300"
                    >
                        <div className="flex gap-1 text-yellow-400 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(testimonial.rating) ? "currentColor" : "none"} className={i < Math.floor(testimonial.rating) ? "" : "text-gray-600"} />
                            ))}
                        </div>
                        
                        <div className="mb-6 relative">
                            <Quote className="absolute -top-2 -left-2 text-white/10 w-10 h-10 -z-10" />
                            <p className="text-gray-200 leading-relaxed font-medium">"{testimonial.content}"</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-white/20">
                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                                <p className="text-gray-400 text-xs">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
