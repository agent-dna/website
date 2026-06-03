import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Ecosystem } from "./components/Ecosystem";
import { SecuritySignals } from "./components/SecuritySignals";
import { AgentsStory } from "./components/AgentsStory";
import { PlatformSteps } from "./components/PlatformSteps";
import { Capabilities } from "./components/Capabilities";
// import { MediaSection } from "./components/MediaSection";
import { BetaAccess } from "./components/BetaAccess";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <Hero />
        <Ecosystem />
        <SecuritySignals />
        <AgentsStory />
        <PlatformSteps />
        <Capabilities />
        {/* <MediaSection /> */}
        <BetaAccess />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
