import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

function TradeExportPage({ token }) {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/trades", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrades(res.data);
      } catch (err) {
        console.error("Failed to load trades", err);
      }
    };

    fetchTrades();
  }, [token]);

  const headers = [
    { label: "Symbol", key: "symbol" },
    { label: "Quantity", key: "quantity" },
    { label: "Price", key: "price" },
    { label: "Timestamp", key: "timestamp" }
  ];

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">📥 Export My Trades</h2>
      {trades.length > 0 ? (
        <CSVLink data={trades} headers={headers} filename="my_trades.csv" className="px-4 py-2 text-white bg-green-600 rounded">
          Download CSV
        </CSVLink>
      ) : (
        <p>No trades to export.</p>
      )}
    </div>
  );
}

export default TradeExportPage;
