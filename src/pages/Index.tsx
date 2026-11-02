import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { VideoSection } from "@/components/VideoSection";
import { KeyFigures } from "@/components/KeyFigures";
import { Programs } from "@/components/Programs";
import { About } from "@/components/About";
import { CampusGallery } from "@/components/CampusGallery";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Admissions } from "@/components/Admissions";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { News } from "@/components/News";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  // Arriving from another page with a link like "/#candidature": scroll to that section once it is rendered.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <ScrollToTop />
      <main>
        <Hero />
        <WhyChooseUs />
        <VideoSection />
        <KeyFigures />
        <Programs />
        <About />
        <CampusGallery />
        <ApplicationForm />
        <Admissions />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
