import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Ecosystem } from "./components/Ecosystem";
import { CTAStrip } from "./components/CTAStrip";
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
        <CTAStrip />
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
