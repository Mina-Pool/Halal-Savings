import Banner from "./components/Banner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GoalSection from "./components/GoalSection";
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

        <section id="goals" className="scroll-mt-24">
          <GoalSection />
        </section>

        <section id="about" className="scroll-mt-24">
          <About />
        </section>

        <section id="moneyworks" className="scroll-mt-24">
          <MoneyWorks />
        </section>

        <section id="mission" className="scroll-mt-24">
          <Mission />
        </section>

        <section id="security" className="scroll-mt-24">
          <Security />
        </section>
      </main>
      <Footer />
    </>
  );
}
