import Banner from "./components/Banner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GoalSection from "./components/GoalSection";
//import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import MoneyWorks from "./components/MoneyWorks";
import Mission from "./components/Mission";
import Security from "./components/Security";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Banner sticky={false} />
      <Header />
      <main>
        <Hero />
        <GoalSection />
        <About />
        <MoneyWorks />
        <Mission />
        <Security />
      </main>
      <Footer />
    </>
  );
}
