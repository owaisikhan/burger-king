import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Menu } from "@/components/sections/Menu";
import { Configurator } from "@/components/sections/Configurator";
import { Overview } from "@/components/sections/Overview";
import { Stats } from "@/components/sections/Stats";
import { Sear } from "@/components/sections/Sear";
import { Craft } from "@/components/sections/Craft";
import { Ingredients } from "@/components/sections/Ingredients";
import { Story } from "@/components/sections/Story";
import { Reserve } from "@/components/sections/Reserve";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="bg-bg text-text">
      <Header />
      <Hero />
      <Menu />
      <Configurator />
      <Overview />
      <Stats />
      <Sear />
      <Craft />
      <Ingredients />
      <Story />
      <Reserve />
      <Footer />
    </main>
  );
}
