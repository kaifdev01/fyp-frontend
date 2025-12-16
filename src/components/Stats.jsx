'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
    { label: "Active Users", value: 50000, suffix: "+" },
    { label: "Projects Completed", value: 120000, suffix: "+" },
    { label: "Average Rating", value: 4.9, suffix: "/5", isFloat: true },
    { label: "Countries Served", value: 150, suffix: "+" }
];

function Counter({ from, to, duration = 2, isFloat = false }) {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState(from);

    useEffect(() => {
        if (!inView) return;

        let startTime;
        let animationFrame;

        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            
            const current = from + (to - from) * progress;
            setDisplayValue(isFloat ? current.toFixed(1) : Math.floor(current));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCounter);
            }
        };

        animationFrame = requestAnimationFrame(updateCounter);

        return () => cancelAnimationFrame(animationFrame);
    }, [inView, from, to, duration, isFloat]);

    return <span ref={nodeRef}>{displayValue}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl translate-x-[50%] translate-y-[50%]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="space-y-2"
                    >
                        <div className="text-4xl sm:text-5xl font-bold mb-2">
                            <Counter from={0} to={stat.value} isFloat={stat.isFloat} />{stat.suffix}
                        </div>
                        <p className="text-blue-100 font-medium text-lg">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
}
