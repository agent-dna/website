import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Ecosystem } from "./components/Ecosystem";
import { ThreatCollage } from "./components/ThreatCollage";
import { AgentsStory } from "./components/AgentsStory";
import { PlatformSteps } from "./components/PlatformSteps";
import { Capabilities } from "./components/Capabilities";
import { MediaSection } from "./components/MediaSection";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <Hero />
        <Ecosystem />
        <ThreatCollage />
        <AgentsStory />
        <PlatformSteps />
        <Capabilities />
        <MediaSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
