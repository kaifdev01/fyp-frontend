"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import TrustedBy from "../components/TrustedBy";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import TopFreelancers from "../components/TopFreelancers";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import CTA from "../components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <Header />

      <main>
        {/* Helper Wrapper to ensure smooth scrolling flow */}
        <div className="flex flex-col gap-0">
          <Hero />
          <TrustedBy />
          <Services />
          <WhyChooseUs />
          <HowItWorks />
          <TopFreelancers />
          <Testimonials />
          <Stats />
          <CTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}
