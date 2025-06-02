import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CACHE = new Map();

function TradeChartPage() {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [news, setNews] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    if (CACHE.has(symbol)) {
      setData(CACHE.get(symbol));
      setLoading(false);
    } else {
      try {
        const res = await axios.get(`http://localhost:8080/api/trades/price/${symbol}`);
        const reversed = res.data.reverse();
        setData(reversed);
        CACHE.set(symbol, reversed);
      } catch {
        setError(`Failed to load data for "${symbol}"`);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  };

  const fetchNews = async () => {
    try {
      const newsRes = await axios.get(
        `https://newsdata.io/api/1/news?apikey=pub_793a6813e11d4f789970009a54166cf7&q=${symbol}&language=en&category=business`
      );
      setNews(newsRes.data.results || []);
    } catch (e) {
      if (e.response?.status === 429) {
        setNews([{ title: "Too many requests", description: "You're being rate-limited by the news API." }]);
      } else {
        console.error('Failed to fetch news:', e);
        setNews([]);
      }
    }
  };
  

  useEffect(() => { fetchData(); }, [symbol]);

  const chartData = {
    labels: data.map(d => d.datetime),
    datasets: [{
      label: `${symbol} Price (₹)`,
      data: data.map(d => parseFloat(d.close)),
      borderColor: 'cyan',
      fill: false,
      tension: 0.1
    }]
  };

  const particlesInit = async (main) => await loadFull(main);

  return (
    <div className="relative min-h-screen pt-2 overflow-hidden text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            links: { enable: true, distance: 140, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 0.6, outModes: { default: "bounce" } },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 2 } },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
          }
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex flex-col gap-4 p-6">
        <h2 className="text-2xl font-bold text-white">📈 Live Stock Dashboard</h2>

        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Enter symbol (e.g., AAPL)"
            value={symbol}
            onChange={e => setSymbol(e.target.value.toUpperCase())}
            className="px-3 py-2 text-black rounded"
          />
          <button onClick={fetchData} className="px-4 py-2 text-white bg-teal-600 rounded">Fetch</button>
        </div>

        {loading && <p>🔄 Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="flex flex-row gap-6 mt-4">
          <div className="w-[60%] h-[400px] bg-white rounded shadow p-4 text-black overflow-hidden">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  x: { title: { display: true, text: 'Time' } },
                  y: { title: { display: true, text: 'Price (₹)' } }
                }
              }}
            />
          </div>

          <div className="w-[38%] max-h-[400px] bg-white rounded shadow p-4 text-black overflow-y-auto">
            <h3 className="mb-3 text-xl font-semibold">📰 Latest {symbol} News</h3>
            <ul className="space-y-2 text-sm">
              {news.length === 0 && <p>No news found.</p>}
              {news.map((item, index) => (
                <li key={index} className="pb-2 border-b">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {item.title}
                  </a>
                  <p className="text-xs text-gray-600">{new Date(item.pubDate).toLocaleString()}</p>
                  <p>{item.description?.slice(0, 150)}...</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeChartPage;
