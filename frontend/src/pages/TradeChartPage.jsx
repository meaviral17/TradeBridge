import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function TradeChartPage({ token }) {
  const [trades, setTrades] = useState([]);
  const [grouped, setGrouped] = useState({});

  // Fetch trades initially from the backend
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/trades", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrades(res.data);
        groupBySymbol(res.data);
      } catch (err) {
        console.error("Failed to load trades", err);
      }
    };

    fetchTrades();
  }, [token]);

  // Setup WebSocket to listen for new trade broadcasts
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe('/topic/trades', (msg) => {
          const trade = JSON.parse(msg.body);
          setTrades((prev) => {
            const updated = [...prev, trade];
            groupBySymbol(updated);
            return updated;
          });
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  // Group trades by symbol for charting
  const groupBySymbol = (data) => {
    const groupedData = {};
    data.forEach(t => {
      const sym = t.symbol.toUpperCase();
      if (!groupedData[sym]) groupedData[sym] = [];
      groupedData[sym].push({ x: t.timestamp, y: t.price });
    });
    setGrouped(groupedData);
  };

  // Chart.js config
  const chartData = {
    labels: trades.map(t => new Date(t.timestamp).toLocaleString()),
    datasets: Object.entries(grouped).map(([symbol, points], i) => ({
      label: symbol,
      data: points,
      borderColor: `hsl(${i * 50}, 70%, 50%)`,
      backgroundColor: `hsl(${i * 50}, 70%, 80%)`,
      fill: false,
      tension: 0.1
    }))
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">📈 My Trade Chart</h2>
      {trades.length === 0 ? (
        <p>No trades found.</p>
      ) : (
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
      )}
    </div>
  );
}

export default TradeChartPage;
