import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Line, Bar, Scatter, Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

function TradeManagePage({ token }) {
  const [trades, setTrades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('All');
  const [selectedFile, setFile] = useState(null);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/trades', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades(res.data);
      setFiltered(res.data);
    } catch {
      console.error('❌ Failed to fetch trades');
    }
  }, [token]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  useEffect(() => {
    if (selectedSymbol === 'All') {
      setFiltered(trades);
    } else {
      setFiltered(trades.filter(t => t.symbol === selectedSymbol));
    }
  }, [selectedSymbol, trades]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axios.post('http://localhost:8080/api/demo/upload-csv', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Upload successful');
      fetchTrades();
    } catch (err) {
      alert('❌ Upload failed: ' + (err?.response?.status || 'unknown error'));
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:8080/api/trades', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades([]);
      setFiltered([]);
    } catch {
      alert('❌ Delete failed');
    }
  };

  const particlesInit = async (engine) => await loadFull(engine);

  const labels = filtered.map((t) => dayjs(t.timestamp).format('HH:mm'));

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Price (₹)',
        data: filtered.map((t) => t.price),
        borderColor: 'crimson',
        backgroundColor: 'crimson',
        borderWidth: 1,
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Quantity',
        data: filtered.map((t) => t.quantity),
        backgroundColor: 'teal',
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Price vs Quantity',
        data: filtered.map((t) => ({ x: t.quantity, y: t.price })),
        backgroundColor: 'orange',
      },
    ],
  };

  const pieChartData = {
    labels: Array.from(new Set(filtered.map((t) => t.symbol))),
    datasets: [
      {
        label: 'Quantity Share',
        data: Array.from(new Set(filtered.map((t) => t.symbol))).map(
          (sym) => filtered.filter((t) => t.symbol === sym).reduce((sum, t) => sum + t.quantity, 0)
        ),
        backgroundColor: ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa'],
        borderWidth: 0,
      },
    ],
  };

  const summary = {
    totalTrades: filtered.length,
    totalQuantity: filtered.reduce((sum, t) => sum + t.quantity, 0),
    highestPrice: Math.max(...filtered.map(t => t.price), 0),
    averageQuantity: filtered.length ? (filtered.reduce((sum, t) => sum + t.quantity, 0) / filtered.length).toFixed(2) : 0,
    mostTradedSymbol: (() => {
      const counts = {};
      filtered.forEach(t => counts[t.symbol] = (counts[t.symbol] || 0) + 1);
      return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0];
    })(),
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: '' }, grid: { display: false } },
      y: { title: { display: true, text: '' }, grid: { display: false } },
    },
  };

  const headers = [
    { label: 'Symbol', key: 'symbol' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Price', key: 'price' },
    { label: 'Timestamp', key: 'timestamp' },
  ];

  const symbols = ['All', ...Array.from(new Set(trades.map(t => t.symbol)))];

  return (
    <div className="relative min-h-screen pt-3 text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Particles init={particlesInit} options={{ fullScreen: { enable: false }, particles: { number: { value: 90 }, color: { value: '#ffffff' }, links: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 }, move: { enable: true, speed: 0.5, outModes: { default: 'bounce' } }, opacity: { value: 0.6, animation: { enable: true, speed: 0.5, minimumValue: 0.2 } }, size: { value: { min: 1, max: 2.5 } } }, interactivity: { events: { onHover: { enable: true, mode: 'grab' } }, modes: { grab: { distance: 150 } } } }} className="absolute inset-0 z-0" />
      <div className="relative z-10 flex flex-col gap-3 p-2">
        <h2 className="text-2xl font-bold text-white">📊 Manage My Trades</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} className="px-3 py-1 text-white bg-blue-600 rounded">Upload</button>
          <CSVLink data={filtered} headers={headers} filename="filtered_trades.csv" className="px-3 py-1 text-white bg-green-600 rounded">Download CSV</CSVLink>
          <button onClick={handleDeleteAll} className="px-3 py-1 text-white bg-red-600 rounded">🗑️ Delete All</button>
          <select onChange={e => setSelectedSymbol(e.target.value)} value={selectedSymbol} className="p-1 text-black border rounded">{symbols.map((sym, i) => <option key={i} value={sym}>{sym}</option>)}</select>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-6">
          <div className="h-[250px] bg-white rounded shadow p-4 overflow-hidden">
            <h3 className="mb-2 font-semibold text-black">Price Over Time</h3>
            <Line data={lineChartData} options={{ ...commonOptions, scales: { x: { title: { display: true, text: 'Time (HH:mm)' }, grid: { display: false } }, y: { title: { display: true, text: 'Price (₹)' }, grid: { display: false } } } }} />
          </div>
          <div className="h-[250px] bg-white rounded shadow p-4 overflow-hidden">
            <h3 className="mb-2 font-semibold text-black">Quantity Over Time</h3>
            <Bar data={barChartData} options={{ ...commonOptions, scales: { x: { title: { display: true, text: 'Time (HH:mm)' }, grid: { display: false } }, y: { title: { display: true, text: 'Quantity' }, grid: { display: false } } } }} />
          </div>
          <div className="h-[250px] bg-white rounded shadow p-4 overflow-y-auto">
            <h3 className="mb-2 text-xl font-semibold text-black">📋 Trades Table</h3>
            <div className="text-sm text-black max-h-[200px] overflow-y-auto">{filtered.length === 0 && <p>No data.</p>}{filtered.slice(0, 100).map((t, i) => (<div key={i} className="py-1 border-b"><div><b>{t.symbol}</b> | Qty: {t.quantity} | ₹{t.price}</div><div className="text-xs text-gray-500">{dayjs(t.timestamp).format('YYYY-MM-DD HH:mm')}</div></div>))}</div>
          </div>
          <div className="h-[250px] bg-white rounded shadow p-4 overflow-hidden">
            <h3 className="mb-2 font-semibold text-black">Price vs Quantity</h3>
            <Scatter data={scatterChartData} options={{ ...commonOptions, scales: { x: { title: { display: true, text: 'Quantity' }, grid: { display: false } }, y: { title: { display: true, text: 'Price (₹)' }, grid: { display: false } } } }} />
          </div>
          <div className="h-[250px] bg-white rounded shadow p-2 overflow-hidden">
            <h3 className="mb-2 font-semibold text-black">Quantity Share by Symbol</h3>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { display: false, grid: { display: false } }, y: { display: false, grid: { display: false } } } }} />
          </div>
          <div className="h-[250px] bg-white rounded-2xl shadow-lg p-4 overflow-auto flex flex-col justify-between">
  <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-800">
    📈 Trade Summary
    <span className="px-2 py-1 ml-auto text-xs text-gray-600 bg-gray-200 rounded">Live</span>
  </h3>

  <div className="space-y-2 text-sm text-gray-800">
    <div className="flex items-center justify-between">
      <span>Total Trades</span>
      <span className="font-semibold text-blue-600">{summary.totalTrades}</span>
    </div>
    <div className="flex items-center justify-between">
      <span>Total Quantity</span>
      <span className="font-semibold text-green-600">{summary.totalQuantity}</span>
    </div>
    <div className="flex items-center justify-between">
      <span>Most Traded</span>
      <span className="inline-flex items-center gap-1 font-medium text-purple-600">
        {summary.mostTradedSymbol || 'N/A'}
        <span className="text-xs text-gray-500">
          ({(
            (filtered.filter(t => t.symbol === summary.mostTradedSymbol).length /
              (summary.totalTrades || 1)) * 100
          ).toFixed(1)}%)
        </span>
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span>Highest Price</span>
      <span className="font-semibold text-red-600">₹{summary.highestPrice}</span>
    </div>
    <div className="flex items-center justify-between">
      <span>Avg Quantity/Trade</span>
      <span className="font-semibold text-yellow-600">{summary.averageQuantity}</span>
    </div>
  </div>

  <div className="w-full h-1 mt-3 overflow-hidden bg-gray-200 rounded-full">
    <div
      className="h-full bg-gradient-to-r from-blue-500 to-teal-400"
      style={{ width: `${Math.min(summary.totalTrades, 100)}%` }}
    />
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

export default TradeManagePage;
