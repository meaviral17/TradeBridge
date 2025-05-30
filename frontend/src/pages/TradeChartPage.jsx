import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const CACHE = new Map();

function TradeChartPage() {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    if (CACHE.has(symbol)) {
      setData(CACHE.get(symbol));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/trades/price/${symbol}`);
      const reversed = res.data.reverse();
      setData(reversed);
      CACHE.set(symbol, reversed);
    } catch (err) {
      console.error('API fetch failed', err);
      setError(`Failed to load data for "${symbol}". Please check the symbol or try again later.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const chartData = {
    labels: data.map(d => d.datetime),
    datasets: [{
      label: `${symbol} Price`,
      data: data.map(d => parseFloat(d.close)),
      borderColor: 'blue',
      fill: false,
      tension: 0.1
    }]
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">📈 Live Stock Price Chart</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter symbol (e.g., AAPL)"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          className="px-3 py-2 border rounded"
        />
        <button onClick={fetchData} className="px-4 py-2 ml-2 text-white bg-blue-600 rounded">Fetch</button>
      </div>
      {loading && <p>🔄 Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && data.length > 0 && (
        <div style={{ height: '50vh', position: 'relative' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' } }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TradeChartPage;
