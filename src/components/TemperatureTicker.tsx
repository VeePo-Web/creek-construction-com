import { useState, useEffect } from "react";
import useAlbertaTemp from "@/hooks/useAlbertaTemp";
import useSeason from "@/hooks/useSeason";

interface TemperatureTickerProps {
  footerMode?: boolean;
  className?: string;
}

const getSeasonMessage = (season: string, temp: number | null): string => {
  if (season === "winter") {
    if (temp !== null && temp < -10) return "Peak sauna season.";
    return "Perfect sauna weather.";
  }
  if (season === "spring") return "Thaw season. Heat up.";
  if (season === "summer") return "Cool down after the plunge.";
  if (season === "fall") return "Crisp air. Hot stones.";
  return "Perfect sauna weather.";
};

const TemperatureTicker = ({ footerMode = false, className }: TemperatureTickerProps) => {
  const { temp, loading } = useAlbertaTemp();
  const season = useSeason();
  const [hovered, setHovered] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Return visit: "Welcome back." flash
  useEffect(() => {
    try {
      const visited = localStorage.getItem("bp_visited");
      if (visited === "true") {
        setShowWelcome(true);
        const timer = setTimeout(() => setShowWelcome(false), 1500);
        return () => clearTimeout(timer);
      }
    } catch { /* Private browsing or storage unavailable */ }
  }, []);

  if (loading || temp === null) return null;

  const activeHover = hovered && !footerMode;
  const seasonMessage = getSeasonMessage(season, temp);

  return (
    <div
      role="status"
      aria-live="polite"
      className={className || "hidden lg:flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 cursor-default relative"}
      style={{ width: footerMode ? 130 : activeHover ? 280 : 110 }}
      onMouseEnter={() => !footerMode && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={
        footerMode
          ? "Sauna stone temperature: 85 degrees Celsius"
          : `Current temperature in Edmonton: ${temp} degrees Celsius`
      }
    >
      {/* Layer 1: Live weather (or welcome back flash) */}
      <span
        className={`text-minimal tabular-nums transition-opacity duration-700 ${showWelcome ? "text-cedar" : "text-muted-foreground"}`}
        style={{ opacity: footerMode ? 0 : 1 }}
      >
        {showWelcome ? "Welcome back." : `${temp}°C Edmonton`}
      </span>
      <span
        className="text-minimal text-cedar ml-3 transition-opacity duration-200"
        style={{ opacity: activeHover && !showWelcome ? 1 : 0 }}
      >
        {seasonMessage}
      </span>

      {/* Layer 2: Löyly crossfade */}
      <span
        className="absolute inset-0 flex items-center text-minimal text-cedar tabular-nums transition-opacity duration-700"
        style={{ opacity: footerMode ? 1 : 0 }}
      >
        85°C — löyly
      </span>
    </div>
  );
};

export default TemperatureTicker;
