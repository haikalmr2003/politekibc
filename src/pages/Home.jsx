import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Programs from "../components/Programs";
import WhyChoose from "../components/WhyChoose";
import Timeline from "../components/Timeline";
import PlacementCTA from "../components/PlacementCTA";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { stats, programs, whyChoose, testimonials } from "../data/dummy";

/**
 * Home page composes the various components.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats items={stats} />
        <Programs items={programs} />
        <WhyChoose items={whyChoose} />
        <Timeline />
        <PlacementCTA />
        <Testimonials items={testimonials} />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
