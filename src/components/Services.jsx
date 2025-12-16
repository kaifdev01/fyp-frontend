'use client';
import { motion } from 'framer-motion';
import { Code, Palette, TrendingUp, Smartphone, PenTool, Video, Globe, Database, ArrowRight } from 'lucide-react';

const services = [
  { title: "Website Development", icon: <Code size={32} />, color: "bg-blue-100 text-blue-600", price: "From $500" },
  { title: "Logo Design", icon: <Palette size={32} />, color: "bg-pink-100 text-pink-600", price: "From $50" },
  { title: "SEO Optimization", icon: <TrendingUp size={32} />, color: "bg-green-100 text-green-600", price: "From $300" },
  { title: "Mobile Apps", icon: <Smartphone size={32} />, color: "bg-purple-100 text-purple-600", price: "From $1200" },
  { title: "Content Writing", icon: <PenTool size={32} />, color: "bg-yellow-100 text-yellow-600", price: "From $100" },
  { title: "Video Editing", icon: <Video size={32} />, color: "bg-red-100 text-red-600", price: "From $150" },
  { title: "Translation", icon: <Globe size={32} />, color: "bg-indigo-100 text-indigo-600", price: "From $75" },
  { title: "Data Analysis", icon: <Database size={32} />, color: "bg-cyan-100 text-cyan-600", price: "From $200" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Popular Professional Services</h2>
          <p className="text-xl text-gray-600">Get your project done by experts in their field</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6`}>
                {service.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
              <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-500 text-sm font-medium">{service.price}</p>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
