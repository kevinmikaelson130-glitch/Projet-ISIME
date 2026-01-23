import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { KeyFigures } from "@/components/KeyFigures";
import { Programs } from "@/components/Programs";
import { About } from "@/components/About";
import { CampusGallery } from "@/components/CampusGallery";
import { Blog } from "@/components/Blog";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Admissions } from "@/components/Admissions";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <KeyFigures />
        <Programs />
        <About />
        <CampusGallery />
        <Blog />
        <ApplicationForm />
        <Admissions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
