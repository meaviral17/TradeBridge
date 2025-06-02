import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Tilt from "react-parallax-tilt";

const cards = [
  {
    title: "💼 Start a Meeting",
    desc: "Collaborate in real-time using secure video rooms.",
    link: "/meeting",
  },
  {
    title: "📊 Analyse Trades",
    desc: "Manage & analyze trades with ease.",
    link: "/manage",
  },
  {
    title: "🌍 Global Market Tracker",
    desc: "Visualize global trends in real time.",
    link: "/chart",
  },
];

export default function Home() {
  const particlesInit = async (main) => await loadFull(main);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "#000" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: true,
            },
            modes: {
              grab: { distance: 150, line_linked: { opacity: 0.4 } },
            },
          },
          particles: {
            number: {
              value: 90,
              density: { enable: true, area: 800 },
            },
            color: { value: "#ffffff" },
            links: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.5,
              outModes: { default: "bounce" },
            },
            opacity: {
              value: 0.6,
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.2,
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 1, max: 2.5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 px-6 pt-24 text-white"> {/* ⬅️ added pt-24 for fixed header */}
        <motion.h1
          className="text-5xl font-extrabold text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌐 Welcome to <span className="text-teal-400">TradeBridge</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-lg text-center text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          A unified hub to trade, track, and collaborate globally.
        </motion.p>

        <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Tilt key={index} glareEnable={true} glareMaxOpacity={0.2} className="rounded-xl">
              <motion.div
                className="p-6 rounded-xl shadow-lg bg-gray-900 border border-gray-700 hover:scale-[1.03] transition-all"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 + 0.6 }}
              >
                <h2 className="mb-2 text-2xl font-bold text-teal-300">{card.title}</h2>
                <p className="mb-4 text-gray-400">{card.desc}</p>
                <Link
                  to={card.link}
                  className="inline-block px-4 py-2 text-white transition bg-teal-500 rounded hover:bg-teal-600"
                >
                  Explore →
                </Link>
              </motion.div>
            </Tilt>
          ))}
        </div>

        <motion.footer
          className="mt-20 text-sm text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          © {new Date().getFullYear()} TradeBridge. All rights reserved.
        </motion.footer>
      </div>
    </div>
  );
}
