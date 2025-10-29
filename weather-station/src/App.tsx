
import React, { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  Home,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Search,
  Crosshair,
  LocateFixed,
  Settings as SettingsIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- Leaflet icon fix (for many bundlers) ------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- Types ---------------- */
interface WeatherData {
  temperature: string;
  humidity: string;
  windSpeed: string;
  rainfall: string;
  location: string;
  description: string;
  icon?: string;
  raw?: any;
}

interface ForecastEntry {
  dt_txt: string;
  main: { temp: number; temp_min?: number; temp_max?: number };
  weather: { description: string; icon: string; main: string }[];
  raw?: any;
}

/* ---------------- API placeholder ---------------- */
const API_KEY = "c293693e9b88c02220329ac54bd278a5"; // <-- replace with your OpenWeather API key

/* ---------------- Small formatting helpers ---------------- */
const fmtTemp = (t?: number) =>
  t === undefined || t === null ? "-- °C" : `${Math.round(t)} °C`;
const fmtHumidity = (h?: number) =>
  h === undefined || h === null ? "-- %" : `${Math.round(h)} %`;
const fmtWind = (w?: number) =>
  w === undefined || w === null ? "-- km/h" : `${Math.round(w * 3.6)} km/h`;

/* ---------------- Map click-to-pick helper ---------------- */
function MapClickSelect({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/* ---------------- Main App ---------------- */
const App: React.FC = () => {
  /* ---------------- UI + weather state ---------------- */
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [weather, setWeather] = useState<WeatherData>({
    temperature: "-- °C",
    humidity: "-- %",
    windSpeed: "-- km/h",
    rainfall: "-- mm",
    location: "Enter your location",
    description: "--",
  });

  const [forecastList, setForecastList] = useState<ForecastEntry[]>([]);
  const [day1, setDay1] = useState<ForecastEntry | null>(null);
  const [day2, setDay2] = useState<ForecastEntry | null>(null);
  const [day3, setDay3] = useState<ForecastEntry | null>(null);
  const [day4, setDay4] = useState<ForecastEntry | null>(null);
  const [day5, setDay5] = useState<ForecastEntry | null>(null);

  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const [pickedCoords, setPickedCoords] = useState<[number, number] | null>(null);

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [heavyAnimations, setHeavyAnimations] = useState<boolean>(true);
  const [rainCount, setRainCount] = useState<number>(90);
  const [snowCount, setSnowCount] = useState<number>(70);

  // theme state (derived from API or time)
  type Theme =
    | "clear-day"
    | "clear-night"
    | "clouds"
    | "rain"
    | "thunder"
    | "snow"
    | "fog";

  const [theme, setTheme] = useState<Theme>("clear-day");
  // used to trigger lightning bolts
  const [boltTick, setBoltTick] = useState<number>(0);

  /* ---------------- Helpers ---------------- */
  const pickFiveNoons = (list: ForecastEntry[]) => {
    const picks: ForecastEntry[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < list.length && picks.length < 5; i++) {
      const e = list[i];
      if (!e?.dt_txt) continue;
      if (e.dt_txt.includes("12:00:00")) {
        const day = e.dt_txt.split(" ")[0];
        if (!seen.has(day)) {
          picks.push(e);
          seen.add(day);
        }
      }
    }
    if (picks.length < 5) {
      for (let i = 0; i < list.length && picks.length < 5; i++) {
        const e = list[i];
        const day = e.dt_txt.split(" ")[0];
        if (!seen.has(day)) {
          picks.push(e);
          seen.add(day);
        }
      }
    }
    setDay1(picks[0] ?? null);
    setDay2(picks[1] ?? null);
    setDay3(picks[2] ?? null);
    setDay4(picks[3] ?? null);
    setDay5(picks[4] ?? null);
  };

  const deriveThemeFromAPI = (main?: string, icon?: string) => {
    const m = (main || "").toLowerCase();
    const isNight = icon?.endsWith("n");
    if (m.includes("clear")) {
      setTheme(isNight ? "clear-night" : "clear-day");
    } else if (m.includes("cloud")) {
      setTheme("clouds");
    } else if (m.includes("rain") || m.includes("drizzle")) {
      setTheme("rain");
    } else if (m.includes("thunder") || m.includes("thunderstorm")) {
      setTheme("thunder");
    } else if (m.includes("snow")) {
      setTheme("snow");
    } else if (m.includes("mist") || m.includes("fog") || m.includes("haze")) {
      setTheme("fog");
    } else {
      setTheme(isNight ? "clear-night" : "clear-day");
    }
  };

  /* ---------------- Fetch functions ---------------- */
  const fetchByCity = async (city: string) => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }
    setIsLoading(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;

      const [wRes, fRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
      const wJson = await wRes.json();
      const fJson = await fRes.json();

      if (wRes.status !== 200) {
        alert(wJson.message || "Failed to fetch current weather");
        setIsLoading(false);
        return;
      }
      if (fRes.status !== 200) {
        alert(fJson.message || "Failed to fetch forecast");
        setIsLoading(false);
        return;
      }

      // set weather
      setWeather({
        temperature: fmtTemp(wJson.main?.temp),
        humidity: fmtHumidity(wJson.main?.humidity),
        windSpeed: fmtWind(wJson.wind?.speed),
        rainfall:
          wJson.rain && (wJson.rain["1h"] || wJson.rain["3h"])
            ? `${wJson.rain["1h"] ?? wJson.rain["3h"]} mm`
            : "0 mm",
        location:
          wJson.name && wJson.sys?.country ? `${wJson.name}, ${wJson.sys.country}` : wJson.name ?? "Selected Location",
        description: wJson.weather?.[0]?.description ?? "--",
        icon: wJson.weather?.[0]?.icon,
        raw: wJson,
      });

      // forecast
      const list: ForecastEntry[] = fJson.list ?? [];
      setForecastList(list);
      pickFiveNoons(list);

      // theme
      deriveThemeFromAPI(wJson.weather?.[0]?.main, wJson.weather?.[0]?.icon);
    } catch (err) {
      console.error("fetchByCity error:", err);
      alert("Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchByCoords = async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const [wRes, fRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
      const wJson = await wRes.json();
      const fJson = await fRes.json();

      if (wRes.status !== 200) {
        alert(wJson.message || "Failed to fetch current weather");
        setIsLoading(false);
        return;
      }
      if (fRes.status !== 200) {
        alert(fJson.message || "Failed to fetch forecast");
        setIsLoading(false);
        return;
      }

      setWeather({
        temperature: fmtTemp(wJson.main?.temp),
        humidity: fmtHumidity(wJson.main?.humidity),
        windSpeed: fmtWind(wJson.wind?.speed),
        rainfall:
          wJson.rain && (wJson.rain["1h"] || wJson.rain["3h"])
            ? `${wJson.rain["1h"] ?? wJson.rain["3h"]} mm`
            : "0 mm",
        location:
          wJson.name && wJson.sys?.country ? `${wJson.name}, ${wJson.sys.country}` : wJson.name ?? "Selected Location",
        description: wJson.weather?.[0]?.description ?? "--",
        icon: wJson.weather?.[0]?.icon,
        raw: wJson,
      });

      const list: ForecastEntry[] = fJson.list ?? [];
      setForecastList(list);
      pickFiveNoons(list);

      deriveThemeFromAPI(wJson.weather?.[0]?.main, wJson.weather?.[0]?.icon);
    } catch (err) {
      console.error("fetchByCoords error:", err);
      alert("Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Device geolocation ---------------- */
  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPickedCoords([lat, lon]);
        fetchByCoords(lat, lon).finally(() => setIsLoading(false));
      },
      (err) => {
        console.error("geolocation error", err);
        alert("Unable to retrieve your device location");
        setIsLoading(false);
      }
    );
  };

  /* ---------------- Map click handler (select & close) ---------------- */
  const handleMapSelectAndClose = (lat: number, lon: number) => {
    setPickedCoords([lat, lon]);
    setMapOpen(false);
    fetchByCoords(lat, lon);
  };

  /* ---------------- Lightning bolt ticker for thunder theme ---------------- */
  useEffect(() => {
    let id: number | null = null;
    if (theme === "thunder") {
      id = window.setInterval(() => {
        setBoltTick((s) => s + 1);
      }, 4200);
    }
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [theme]);

  /* ---------------- Cinematic CSS (single-file) ---------------- */
  const cinematicCSS = `
  /* Cinematic background & particles */
  :root {
    --glass: rgba(17,24,39,0.6);
    --glass-2: rgba(17,24,39,0.45);
  }

  .bg-layer {
    position: fixed;
    inset: 0;
    z-index: -30;
    pointer-events: none;
    overflow: hidden;
  }

  /* gradients for themes */
  .bg-clear-day { background: linear-gradient(180deg, #c7f2ff 0%, #ffe8a8 45%, #fff2d1 100%); }
  .bg-clear-night { background: linear-gradient(180deg, #071033 0%, #0b2447 50%, #071233 100%); }
  .bg-clouds { background: linear-gradient(180deg, #e6eef7 0%, #cfd8e3 50%, #a9b4c7 100%); }
  .bg-rain { background: linear-gradient(180deg, #243B52 0%, #12202B 60%, #081018 100%); }
  .bg-thunder { background: linear-gradient(180deg, #1b2530 0%, #0f1720 70%); }
  .bg-snow { background: linear-gradient(180deg, #e6f0fb 0%, #cfe6fb 60%, #eaf6ff 100%); }
  .bg-fog { background: linear-gradient(180deg, #f2f5f7 0%, #e6eaed 60%, #dfe6ea 100%); }

  /* Sun / Moon shapes */
  .cin-sun, .cin-moon {
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    top: 6%;
    left: -10%;
    filter: blur(0.6px) drop-shadow(0 40px 100px rgba(0,0,0,0.35));
    z-index: -10;
  }
  .cin-sun {
    background: radial-gradient(circle at 30% 30%, #fff8c2, #ffb86b 60%, rgba(255,120,20,0.12));
  }
  .cin-moon {
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.92), rgba(210,230,255,0.12));
    box-shadow: inset 0 10px 40px rgba(180,200,255,0.06);
  }

  /* Cloud shapes (big, blurred for cinematic) */
  .cin-cloud {
    position: absolute;
    border-radius: 9999px;
    filter: blur(14px);
    background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    z-index: -8;
    opacity: 0.95;
  }
  .cloud-1 { width: 720px; height: 180px; top: 6%; left: -30%; transform: scale(1.02); animation: cloudMove 60s linear infinite; }
  .cloud-2 { width: 560px; height: 160px; top: 18%; left: -40%; transform: scale(0.95); animation: cloudMove 78s linear infinite; opacity: 0.88; }
  .cloud-3 { width: 420px; height: 120px; top: 28%; left: -22%; animation: cloudMoveReverse 68s linear infinite; opacity: 0.9; }

  @keyframes cloudMove { 0% { transform: translateX(0) } 50% { transform: translateX(180%) } 100% { transform: translateX(0) } }
  @keyframes cloudMoveReverse { 0% { transform: translateX(0) } 50% { transform: translateX(-180%) } 100% { transform: translateX(0) } }

  /* Stars for night */
  .stars { position:absolute; inset:0; pointer-events:none; z-index:-12; }
  .star {
    position:absolute;
    width:2px; height:2px; border-radius:50%; background:white; filter: blur(0.6px);
    animation: twinkle 3s infinite ease-in-out;
  }
  @keyframes twinkle { 0% { opacity:0.2; transform:scale(.8) } 50% { opacity:1; transform:scale(1.2) } 100% { opacity:0.2; transform:scale(.8) } }

  /* Rain */
  .rain-layer { position:absolute; inset:0; pointer-events:none; z-index:-4; overflow:hidden; opacity:0.65; }
  .raindrop {
    position:absolute;
    width:2px; height:26px; background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2));
    border-radius:2px; filter: blur(0.2px);
    animation: dropFall linear infinite;
  }
  @keyframes dropFall { to { transform: translateY(120vh); opacity: 0.12 } }

  /* Snow */
  .snow-layer { position:absolute; inset:0; pointer-events:none; z-index:-4; overflow:hidden; opacity:0.95; }
  .flake {
    position:absolute; width:6px; height:6px; background:white; border-radius:50%;
    animation: snowFall linear infinite;
  }
  @keyframes snowFall { to { transform: translateY(120vh) rotate(360deg); } }

  /* Fog */
  .fog-layer { position:absolute; inset:0; pointer-events:none; z-index:-6; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02)); filter: blur(6px); animation: fogFloat 20s linear infinite; opacity:0.42; }
  @keyframes fogFloat { 0% { transform: translateX(-8%) } 50% { transform: translateX(8%) } 100% { transform: translateX(-8%) } }

  /* Lightning flash overlay */
  .bolt-overlay { position:absolute; inset:0; pointer-events:none; z-index:-2; background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0)); opacity:0; }
  .bolt { animation: boltAnim 1.1s cubic-bezier(.2,.9,.2,1); }
  @keyframes boltAnim { 0% { opacity:0 } 5% { opacity:0.95 } 15% { opacity:0 } 100% { opacity:0 } }

  /* Decorative glow dots (cinematic) */
  .glow-dot { position:absolute; border-radius:9999px; filter: blur(0.6px); z-index:-5; }
  .g1 { left:6%; top:22%; width:12px; height:12px; background: rgba(16,185,129,0.92); animation: pulseDot 3s infinite; }
  .g2 { right:10%; top:30%; width:8px; height:8px; background: rgba(16,185,129,0.7); animation: pulseDot 2.4s infinite; }
  .g3 { left:30%; top:62%; width:14px; height:14px; background: rgba(16,185,129,0.6); animation: pulseDot 4s infinite; }
  @keyframes pulseDot { 0% { transform: scale(.9); opacity: .95 } 50% { transform: scale(1.05); opacity: .5 } 100% { transform: scale(.9); opacity:.95 } }

  /* UI glass card */
  .ui-card { background: linear-gradient(180deg, rgba(17,24,39,0.6), rgba(17,24,39,0.45)); border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); backdrop-filter: blur(8px); }

  /* Map modal styles */
  .map-modal { position: fixed; inset: 0; display:flex; justify-content:center; align-items:center; z-index:60; }
  .map-container-frame { width: 92%; max-width: 1400px; height: 82vh; border-radius: 12px; overflow:hidden; box-shadow: 0 40px 120px rgba(0,0,0,0.6); }

  /* small responsive tweaks */
  @media (max-width: 768px) {
    .cin-sun, .cin-moon { width: 120px; height: 120px; top: 4% }
    .cloud-1 { width: 420px; height: 120px; }
  }
  `;

  /* ---------------- Dynamic particle generators ---------------- */
  const renderRain = (count: number) => {
    const drops = [];
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 0.8 + Math.random() * 1.6;
      const opacity = 0.25 + Math.random() * 0.7;
      drops.push(
        <div
          key={`r-${i}`}
          className="raindrop"
          style={{
            left: `${left}%`,
            top: `-${Math.random() * 20}vh`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity,
          }}
        />
      );
    }
    return <div className="rain-layer">{drops}</div>;
  };

  const renderSnow = (count: number) => {
    const flakes = [];
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 3;
      const duration = 4 + Math.random() * 6;
      const size = 2 + Math.random() * 6;
      const opacity = 0.4 + Math.random() * 0.6;
      flakes.push(
        <div
          key={`f-${i}`}
          className="flake"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            top: `-${Math.random() * 20}vh`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity,
          }}
        />
      );
    }
    return <div className="snow-layer">{flakes}</div>;
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 110; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 60;
      const size = Math.random() * 2 + 0.5;
      const delay = Math.random() * 3;
      const opacity = 0.3 + Math.random() * 0.7;
      stars.push(
        <div
          key={`s-${i}`}
          className="star"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
            opacity,
            position: "absolute",
            borderRadius: "50%",
            background: "white",
            zIndex: -12,
          }}
        />
      );
    }
    return <div className="stars">{stars}</div>;
  };

  /* ---------------- Auto night fallback: if API doesn't indicate night, use local time after-hours ---------------- */
  useEffect(() => {
    // If theme is clear-day but local time is night, flip to clear-night for better visuals
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      // only adjust if theme is currently clear-day or similar
      if (theme === "clear-day") setTheme("clear-night");
    }
    // don't set dependency; run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- card animation variants ---------------- */
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.06 * i, duration: 0.45 },
    }),
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* -------------- Inject cinematic CSS block -------------- */}
      <style>{cinematicCSS}</style>

      {/* -------------- Background Layers -------------- */}
      <div
        className={`bg-layer ${
          theme === "clear-day"
            ? "bg-clear-day"
            : theme === "clear-night"
            ? "bg-clear-night"
            : theme === "clouds"
            ? "bg-clouds"
            : theme === "rain"
            ? "bg-rain"
            : theme === "thunder"
            ? "bg-thunder"
            : theme === "snow"
            ? "bg-snow"
            : "bg-fog"
        }`}
      >
        {/* Sun / Moon drift */}
        {theme === "clear-day" && (
          <motion.div
            className="cin-sun"
            initial={{ x: "-25vw" }}
            animate={{ x: ["-25vw", "85vw", "-25vw"] }}
            transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
            style={{ left: "-10%" }}
          />
        )}
        {theme === "clear-night" && (
          <>
            <motion.div
              className="cin-moon"
              initial={{ x: "-25vw", rotate: 0 }}
              animate={{ x: ["-25vw", "85vw", "-25vw"], rotate: [0, 360, 0] }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              style={{ left: "-10%" }}
            />
            {renderStars()}
          </>
        )}

        {/* Clouds for cloudy, also displayed mildly for other themes */}
        {(theme === "clouds" || theme === "clear-day" || theme === "rain" || theme === "thunder" || theme === "snow") && (
          <>
            <div className="cin-cloud cloud-1" />
            <div className="cin-cloud cloud-2" />
            <div className="cin-cloud cloud-3" />
          </>
        )}

        {/* Rain */}
        {theme === "rain" && (heavyAnimations ? renderRain(rainCount) : renderRain(Math.round(rainCount / 3)))}

        {/* Thunder (rain + lightning) */}
        {theme === "thunder" && (
          <>
            {heavyAnimations ? renderRain(Math.round(rainCount * 1.1)) : renderRain(Math.round(rainCount / 2))}
            {/* lightning overlay - retiggered by boltTick */}
            <div className={`bolt-overlay ${boltTick % 2 === 0 ? "bolt" : ""}`} />
          </>
        )}

        {/* Snow */}
        {theme === "snow" && (heavyAnimations ? renderSnow(snowCount) : renderSnow(Math.round(snowCount / 2)))}

        {/* Fog */}
        {theme === "fog" && (
          <>
            <div className="fog-layer" style={{ opacity: 0.45 }} />
            <div className="fog-layer" style={{ animationDuration: "32s", opacity: 0.32 }} />
          </>
        )}

        {/* decorative glow dots */}
        <div className="glow-dot g1" />
        <div className="glow-dot g2" />
        <div className="glow-dot g3" />
      </div>

      {/* -------------- Nav (top) -------------- */}
      <nav className="relative z-30 mx-6 mt-6 ui-card px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Cloud className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Weather Station</h1>
            {/* Tagline intentionally removed per request */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://agri-ai-4farmer.vercel.app/"
            className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition text-white flex items-center gap-2"
            title="Home"
          >
            <Home className="w-4 h-4" />
            Home
          </a>

          <button
            onClick={() => setSettingsOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-white/6 transition"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* -------------- Settings panel -------------- */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-30 mx-6 mt-4 ui-card p-4 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-emerald-300 font-semibold">Settings</div>
                <div className="text-xs text-gray-300">Control visuals for your demo</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-800/40 rounded-lg">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Heavy animations</span>
                  <input
                    type="checkbox"
                    checked={heavyAnimations}
                    onChange={() => setHeavyAnimations((v) => !v)}
                  />
                </label>
                <p className="text-xs text-gray-400 mt-2">Toggle cinematic particle intensity</p>
              </div>

              <div className="p-3 bg-gray-800/40 rounded-lg">
                <label className="block text-sm text-gray-200 mb-2">Rain particles</label>
                <input
                  type="range"
                  min={10}
                  max={220}
                  value={rainCount}
                  onChange={(e) => setRainCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-2">Count: {rainCount}</div>
              </div>

              <div className="p-3 bg-gray-800/40 rounded-lg">
                <label className="block text-sm text-gray-200 mb-2">Snow particles</label>
                <input
                  type="range"
                  min={10}
                  max={160}
                  value={snowCount}
                  onChange={(e) => setSnowCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 mt-2">Count: {snowCount}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------- Hero -------------- */}
      <header className="relative z-30 text-center mt-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Cloud className="w-28 h-28 text-emerald-400 drop-shadow-2xl animate-pulse" />
              <div className="absolute inset-0 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-emerald-300 mt-4 drop-shadow-lg">
              Real-Time Weather Station
            </h2>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center px-4 py-3 bg-gray-800/60 rounded-full border border-gray-700/50">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="ml-2 text-gray-200 font-medium">{weather.location}</span>
              </div>

              <button
                onClick={() => setMapOpen(true)}
                className="p-3 rounded-full bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/12 transition"
                title="Open map to pick location"
              >
                <Crosshair className="w-6 h-6 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* -------------- Search / Input -------------- */}
      <section className="relative z-30 max-w-3xl mx-auto mt-10 px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchByCity(query);
          }}
          className="ui-card rounded-2xl p-6 shadow-xl border border-gray-700/30 flex flex-col gap-4"
        >
          <h3 className="text-center text-emerald-300 text-xl font-semibold">Enter Your Location</h3>

          <div className="flex gap-3 items-center">
            <input
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-700/20"
              placeholder="City name (e.g., New York, London, Tokyo)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Getting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Get Weather Data
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={useDeviceLocation}
              className="px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              <LocateFixed className="w-5 h-5 mr-2 inline-block" />
              Use My Location
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm">
            Enter a city name or click the crosshair icon to select an exact location on the map.
          </div>
        </form>
      </section>

      {/* -------------- Weather Cards -------------- */}
      <section className="relative z-30 max-w-6xl mx-auto mt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={1}
            className="ui-card rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Thermometer className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">{weather.temperature}</p>
                <p className="text-gray-400 text-sm">Temperature</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={2}
            className="ui-card rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Droplets className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">{weather.humidity}</p>
                <p className="text-gray-400 text-sm">Humidity</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={3}
            className="ui-card rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Wind className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">{weather.windSpeed}</p>
                <p className="text-gray-400 text-sm">Wind Speed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={4}
            className="ui-card rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <CloudRain className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-white text-2xl font-bold">{weather.rainfall}</p>
                <p className="text-gray-400 text-sm">Rainfall</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Forecast */}
        <div className="mt-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 ui-card rounded-xl">
              <Cloud className="w-5 h-5 text-emerald-400" />
              <span className="text-gray-300">5-Day Forecast</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {([day1, day2, day3, day4, day5] as (ForecastEntry | null)[]).map((d, idx) => (
              <div key={idx} className="ui-card rounded-2xl p-5 text-center shadow-xl">
                {d ? (
                  <>
                    <div className="text-white font-semibold">
                      {new Date(d.dt_txt).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                      alt={d.weather[0].description}
                      className="mx-auto"
                      style={{ width: 70, height: 70 }}
                    />
                    <div className="text-xl font-bold">{Math.round(d.main.temp)}°C</div>
                    <div className="text-gray-400 capitalize">{d.weather[0].description}</div>
                  </>
                ) : (
                  <div className="text-gray-400">No data</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------- API credit -------------- */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 ui-card rounded-xl">
          <Cloud className="w-5 h-5 text-emerald-400" />
          <span className="text-gray-300">Powered by OpenWeatherMap API</span>
        </div>
      </div>

      {/* -------------- Footer -------------- */}
      <footer className="relative z-30 text-center py-8 border-t border-gray-700/40">
        <p className="text-gray-400">Professional Weather Monitoring Dashboard — Cinematic Demo</p>
      </footer>

      {/* -------------- Map Modal -------------- */}
      <AnimatePresence>
        {mapOpen && (
          <motion.div
            className="map-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="map-container-frame">
              <button
                onClick={() => {
                  setMapOpen(false);
                  setPickedCoords(null);
                }}
                style={{ position: "absolute", top: 12, right: 12, zIndex: 80 }}
                className="px-3 py-1 rounded-md bg-red-600 text-white shadow-lg"
              >
                ✕
              </button>

              <MapContainer
                center={pickedCoords ?? [20, 0]}
                zoom={pickedCoords ? 6 : 2}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickSelect
                  onSelect={(lat, lon) => {
                    handleMapSelectAndClose(lat, lon);
                  }}
                />
                {pickedCoords && <Marker position={pickedCoords} />}
              </MapContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
