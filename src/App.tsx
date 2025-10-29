import React, { useEffect, useRef } from "react";
import { Sprout, Cloud, Network, ArrowRight, Leaf, Users, Globe } from "lucide-react";

function App() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;
    const starsContainer = starsRef.current;
    starsContainer.innerHTML = "";

    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.className = "absolute bg-white rounded-full opacity-70 animate-pulse";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.width = Math.random() * 3 + 1 + "px";
      star.style.height = star.style.width;
      star.style.animationDelay = Math.random() * 3 + "s";
      star.style.animationDuration = Math.random() * 2 + 2 + "s";
      starsContainer.appendChild(star);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-green-900/20 to-emerald-900/30" />
      <div ref={starsRef} className="fixed inset-0 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <Leaf className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              AgriAI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group">
              Features
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
            <button onClick={() => scrollToSection("about")} className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group">
              About
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-gray-300 hover:text-green-400 transition-all duration-300 relative group">
              Contact
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          </div>

          {/* ✅ Fixed AI Chatbot Button */}
          <button
            onClick={() => (window.location.href="https://aipredchatbot12.vercel.app/", "")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 rounded-full font-semibold text-black hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
          >
            AI Chatbot
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-green-900/10 via-transparent to-transparent opacity-50" />
        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent animate-pulse">
              Predict Crop Yields
            </span>
            <br />
            <span className="text-white">with AI Precision</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Leverage AI and data-driven insights to forecast crop yields using soil health, weather patterns, and agricultural data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-full font-bold text-lg text-black hover:from-green-400 hover:to-emerald-400 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 group">
              Download Our App
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-green-500/50 px-8 py-4 rounded-full font-bold text-lg text-green-400 hover:border-green-400 hover:bg-green-500/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 relative z-40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
            Advanced AI Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Marketplace */}
            <a href="https://login-signup-test.vercel.app/" className="block relative z-50">
              <div className="group bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-8 hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sprout className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-300 mb-4">Marketplace</h3>
                <p className="text-gray-300 leading-relaxed">
                  Secure marketplace for procurement of fertilizers and pesticides, to help farmers grow and increase their crop yield.
                </p>
              </div>
            </a>

            {/* Weather Forecasting */}
            <a href="https://weather-station-latest.vercel.app/" className="block relative z-50">
              <div className="group bg-gradient-to-br from-teal-900/20 to-cyan-900/20 backdrop-blur-lg border border-teal-500/30 rounded-2xl p-8 hover:border-teal-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20">
                <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Cloud className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-teal-300 mb-4">Weather Forecasting</h3>
                <p className="text-gray-300 leading-relaxed">
                  Real-time and long-term climate predictions using advanced meteorological data and machine learning algorithms.
                </p>
              </div>
            </a>

            {/* AI Predictions */}
            <a href="https://ai-insightssss.vercel.app/" className="block relative z-50">
              <div className="group bg-gradient-to-br from-emerald-900/20 to-green-900/20 backdrop-blur-lg border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">AI Predictions</h3>
                <p className="text-gray-300 leading-relaxed">
                  Machine learning models for accurate yield forecasts using historical data, current conditions, and predictive analytics.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-emerald-900/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            About AgriAI
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            AgriAI leverages artificial intelligence to empower farmers with data-driven decisions, driving sustainable agricultural practices and improved crop yields.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-300 mb-2"></h3>
              <p className="text-gray-400">Aims to serve Active Farmers</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-teal-300 mb-2"></h3>
              <p className="text-gray-400">Hopes to Serve Countries to help people around</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sprout className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-300 mb-2">95%</h3>
              <p className="text-gray-400">Accuracy Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-green-500/20 bg-black/40 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Leaf className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              AgriAI
            </span>
          </div>
          <p className="text-gray-400 mb-4">© 2025 AgriAI. All rights reserved.</p>
          <p className="text-green-400">
            Contact:{" "}
            <a href="mailto:agriai4farmers@gmail.com" className="hover:text-green-300 transition-colors underline">
              agriai4farmers@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
