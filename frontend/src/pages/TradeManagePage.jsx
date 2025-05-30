import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function TradeManagePage({ token }) {
  const [trades, setTrades] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  // ✅ Load from backend
  const fetchTrades = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/trades', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrades(res.data);
      console.log("✅ Fetched Trades:", res.data);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setMsg("❌ Failed to fetch trades");
    }
  }, [token]);

  // ✅ Filter based on date
  const filterTrades = useCallback(() => {
    const start = startDate ? dayjs(startDate) : null;
    const end = endDate ? dayjs(endDate) : null;

    const result = trades.filter(t => {
      const ts = dayjs(t.timestamp);
      return (!start || ts.isAfter(start)) && (!end || ts.isBefore(end));
    });

    setFiltered(result);
  }, [startDate, endDate, trades]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  useEffect(() => {
    filterTrades();
  }, [filterTrades]);

  // ✅ Upload CSV
  const handleUpload = async () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("🔐 Upload token:", token);
    try {
      await axios.post("http://localhost:8080/api/demo/upload-csv", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      
      
      alert("✅ Upload successful");
      setStartDate('');
      setEndDate(''); 
      fetchTrades();
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed: " + (err?.response?.status || "unknown error"));
    }
  };
  
  const handleDeleteAll = async () => {
    try {
      await axios.delete("http://localhost:8080/api/demo/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrades([]);
      setFiltered([]);
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // ✅ Chart Data
  const chartData = {
    labels: filtered.map(t => dayjs(t.timestamp).format('HH:mm')),
    datasets: [{
      label: 'Trade Price',
      data: filtered.map(t => t.price),
      borderColor: 'blue',
      backgroundColor: 'lightblue',
      fill: false
    }]
  };

  // ✅ CSV Headers
  const headers = [
    { label: "Symbol", key: "symbol" },
    { label: "Quantity", key: "quantity" },
    { label: "Price", key: "price" },
    { label: "Timestamp", key: "timestamp" }
  ];

  return (
    <div className="flex flex-row gap-8 p-6">
      <div className="flex-1">
        <h2 className="mb-2 text-2xl font-bold">📊 Manage My Trades</h2>

        <div className="flex gap-3 mb-4">
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button onClick={handleUpload} className="px-3 py-1 text-white bg-blue-600 rounded">Upload</button>
          <CSVLink data={filtered} headers={headers} filename="filtered_trades.csv" className="px-3 py-1 text-white bg-green-600 rounded">
            Download CSV
          </CSVLink>
          <button onClick={handleDeleteAll} className="px-3 py-1 text-white bg-red-600 rounded">🗑️ Delete All</button>
        </div>

        {msg && <p className="mb-4 text-sm text-gray-700">{msg}</p>}

        <div className="flex gap-4 mb-4">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-1 border" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-1 border" />
        </div>

        <div style={{ height: 300 }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="w-[400px]">
        <h3 className="mb-2 text-xl font-semibold">📋 Trades Table</h3>
        <div className="overflow-y-auto max-h-[600px] text-sm border rounded p-2 bg-white shadow">
          {filtered.length === 0 && <p>No data.</p>}
          {filtered.map((t, i) => (
            <div key={i} className="py-1 border-b">
              <div><b>{t.symbol}</b> | Qty: {t.quantity} | ₹{t.price}</div>
              <div className="text-xs text-gray-500">{dayjs(t.timestamp).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TradeManagePage;