# 📊 TradeBridge

**TradeBridge** is a comprehensive, full-stack trading analysis and collaboration platform that empowers users to perform in-depth trade reviews, monitor global financial markets, and collaborate in real-time through secure virtual meeting rooms. It is purpose-built for financial analysts, traders, and investment teams to make data-driven decisions with confidence.

#### Live Application [https://tradebridgenow.vercel.app](https://tradebridgenow.vercel.app)

---

## 🚀 Key Features

#### 1. Virtual Meeting Rooms

* Fully embedded **video conferencing** via utilizing WebRTC.
* Capabilities include:

  * 📹 Video + 🎤 Audio
  * 🖥️ Screen sharing
  * ✍️ Whiteboard collaboration
* Ideal for real-time team discussions or strategy reviews.

#### 2. CSV-Based Trade Analyzer

Upload and analyze trade data in `.csv` format to generate a rich, visual dashboard:

* **Price Trend Graphs** — Analyze average trade prices over time
* **Profit/Loss Distribution** — Visualize trade performance and risk patterns
* **Trade Frequency Timeline** — Identify activity spikes or trading gaps
* **Symbol-Level Analysis** — Evaluate instrument-specific performance

> Includes support for uploading new CSVs, downloading filtered datasets, and modifying records — making it especially useful for analysts and backtesters.

#### 3. Market Intelligence Dashboard

* **Live Market Prices** using [Twelve Data API](https://twelvedata.com/)
* **Real-Time News Feed** from curated financial news sources
* Helps users correlate macro events with trading decisions

---

## 🛠️ Tech Stack

### 🔧 Backend — Spring Boot

* Java 17
* Spring Security (JWT-based authentication)
* Spring Data JPA
* PostgreSQL (via Supabase)
* Deployed on Render with Docker

### 💻 Frontend — React + Vite

* React 18, Vite
* React Router, Tailwind CSS
* Chart.js for interactive data visualizations
* Axios for API calls
* Deployed on Vercel

### 📡 Integrations

* **[Stream.io](https://getstream.io/)** — Real-time chat and video streaming
* **[Twelve Data](https://twelvedata.com/)** — Stock price feeds
* **[Jitsi Meet](https://jitsi.org/)** — Secure video conferencing

---

## 🔌 API Overview

### Internal Endpoints

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `/api/auth/register` | User registration                        |
| POST   | `/api/auth/login`    | User authentication                      |
| GET    | `/api/stream/token`  | Generates Stream.io token for chat/video |
| POST   | `/api/trades/upload` | Upload and parse CSV                     |
| GET    | `/api/trades/all`    | Fetch all trades for a user              |
| GET    | `/api/trades/price`  | Current stock price lookup               |
| POST   | `/api/trades/edit`   | Modify existing trade entries            |
| GET    | `/api/news/global`   | Fetch latest market news                 |
| GET    | `/api/demo/trades`   | Load dummy trade data                    |

### External APIs

| API Name    | Use Case                  | Auth           |
| ----------- | ------------------------- | -------------- |
| Stream.io   | Chat + Video SDK          | API Key, Token |
| Twelve Data | Live market price feed    | API Key        |
| Jitsi Meet  | Embedded meet/video rooms | Anonymous      |

---

## 🗂 Project Structure

```
.
├── backend/
│   └── src/
│       ├── controller/         # REST Controllers
│       ├── model/              # Entity classes
│       ├── service/            # Business logic
│       ├── repository/         # JPA repositories
│       └── config/             # Security and CORS
├── frontend/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page-level views
│       ├── hooks/              # Custom React hooks
│       └── App.jsx             # Main React app
├── docker/
│   └── Dockerfile              # Backend Dockerfile
├── README.md
```

---

