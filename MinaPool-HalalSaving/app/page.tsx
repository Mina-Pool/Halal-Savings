import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Mission from "./components/Mission";
import Security from "./components/Security";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero /> 
        <About />
        <Mission />
        <Security />
      </main>
      <Footer />
    </>
  );
}