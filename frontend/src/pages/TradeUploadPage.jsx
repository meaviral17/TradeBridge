import React, { useState } from 'react';
import axios from 'axios';

function TradeUploadPage({ token }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const upload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3001/api/trades/upload", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Upload successful");
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">📤 Upload Trades (CSV)</h2>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload} className="px-4 py-2 ml-3 text-white bg-blue-600 rounded">Upload</button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}

export default TradeUploadPage;
