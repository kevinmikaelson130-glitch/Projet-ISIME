import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { KeyFigures } from "@/components/KeyFigures";
import { Programs } from "@/components/Programs";
import { About } from "@/components/About";
import { CampusGallery } from "@/components/CampusGallery";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Admissions } from "@/components/Admissions";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ScrollToTop />
      <main>
        <Hero />
        <WhyChooseUs />
        <KeyFigures />
        <Programs />
        <About />
        <CampusGallery />
        <ApplicationForm />
        <Admissions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
