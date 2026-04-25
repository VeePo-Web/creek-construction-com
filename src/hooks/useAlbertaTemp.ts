import { useState, useEffect } from "react";

interface AlbertaTempResult {
  temp: number | null;
  loading: boolean;
}

const useAlbertaTemp = (): AlbertaTempResult => {
  const [temp, setTemp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchTemp = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=53.55&longitude=-113.49&current_weather=true"
        );
        const data = await res.json();
        setTemp(Math.round(data.current_weather.temperature));
      } catch {
        setTemp(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTemp();
    interval = setInterval(fetchTemp, 30 * 60 * 1000); // refresh every 30 min

    return () => clearInterval(interval);
  }, []);

  return { temp, loading };
};

export default useAlbertaTemp;
