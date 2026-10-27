import HomeHero from "../components/Hero/HomeHero.jsx";
import HomeImageBanner from "../components/Home/HomeImageBanner.jsx";
import HomeFeatures from "../components/Home/HomeFeatures.jsx";
import HomeFlowChart from "../components/Home/HomeFlowChart.jsx";
import HomeImpact from "../components/Home/HomeImpact.jsx";

/**
 * Home page composition only.
 * Navbar, shared background and footer are intentionally managed elsewhere.
 */
export default function Home() {
  return (
    <div className="uu-home-page" id="top">
      <HomeHero />
      <HomeImageBanner />
      <HomeFeatures />
      <HomeFlowChart />
      <HomeImpact />
    </div>
  );
}
