import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Process from "@/components/Process";
import Statement from "@/components/Statement";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import SiteEffects from "@/components/SiteEffects";

export default function Home() {
  return (
    <main>
      
      <SiteEffects />

      <Navbar />

      <div className="page-loader">
        <div className="loader-logo">
          HENRYNAIL
        </div>

        <div className="loader-line"></div>
      </div>

      <Hero />
     <About />
     <Services />
     <Gallery />
      <Process />
      <Statement />
      <Contact />
      <Footer />
      <BookingModal />
    </main>
  );
}