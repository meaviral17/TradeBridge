# 🧠 TradeBridge

**TradeBridge** is an AI-powered full-stack stock analytics platform built for traders and investors to **track**, **analyze**, and **visualize** their trading data while also getting **real-time financial news**, **interactive video meetings**, and **dashboard insights** — all in one unified interface.

---

## 🚀 Features

### 📊 Trade Analytics Dashboard

* Upload and manage CSV trade records
* Dynamic filtering by stock symbols
* Real-time charting:

  * Line chart: price over time
  * Bar chart: quantity over time
  * Scatter plot: price vs quantity
  * Pie chart: quantity share by symbol
* Auto-generated trade summary: total trades, most traded symbol, highest price, etc.
* CSV download of filtered data

### 🌐 Global Stock Market Tracker

* View latest price trends for selected big-tech stocks (e.g., AAPL, GOOGL, TSLA)
* Real-time news feed from **NewsData.io** based on selected stock symbol
* Auto-cache to reduce API load and improve performance

### 🧑‍💼 Unified Meeting System

* Integrated **Jitsi Meet** for video conferences
* Fully embedded meetings with camera/audio controls
* Auto-generated meeting room per session

### 🎨 Beautiful UI/UX

* Animated **particle background**
* Responsive dashboard layout
* TailwindCSS styled components
* Minimal dark theme interface

---

## 🧰 Tech Stack

### Frontend

* **React.js**
* **Tailwind CSS**
* **Chart.js** via `react-chartjs-2`
* **react-router-dom**
* **dayjs** (time formatting)
* **react-csv** (data export)
* **tsparticles** (background animation)
* **axios**

### Backend

* **Spring Boot**
* **Spring Security (JWT Auth)**
* **PostgreSQL**
* **Apache POI** (CSV parsing)
* **Spring Web**
* **JPA/Hibernate**

---

## 🔐 Authentication

* **JWT-based authentication**
* Login/Register endpoints
* User-level access control for APIs

---

## 🌐 External APIs Used

| API           | Purpose                               | Key/Notes                    |
| ------------- | ------------------------------------- | ---------------------------- |
| `NewsData.io` | Real-time news feed for stock symbols | Free plan with rate limiting |
| `Jitsi Meet`  | Embedded video meeting (iframe-based) | No API key needed            |

---

## 📂 Directory Structure

```
tradebridge/
│
├── backend/ (Spring Boot)
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── TradebridgeApplication.java
│
├── frontend/ (React App)
│   ├── pages/
│   ├── components/
│   ├── App.jsx
│   └── index.css
```

---

## 🔁 API Endpoints

### 🔒 Auth

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/login`    | Login with credentials |
| POST   | `/api/auth/register` | Register a new user    |

---

### 📦 Trades

| Method | Endpoint                     | Description                   |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/api/trades`                | Fetch all trades for user     |
| DELETE | `/api/trades`                | Delete all user trade records |
| POST   | `/api/demo/upload-csv`       | Upload CSV of trades          |
| GET    | `/api/trades/price/{symbol}` | Get price history of a symbol |

---

### 📰 News (Proxy call)

| Method | Endpoint                | Description                                     |
| ------ | ----------------------- | ----------------------------------------------- |
| GET    | `/api/news?symbol=AAPL` | Fetch news for a given symbol using NewsData.io |

---

## 🗂️ Sample CSV Format

| symbol | price  | quantity | timestamp           |
| ------ | ------ | -------- | ------------------- |
| AAPL   | 176.22 | 10       | 2024-06-01 12:23:00 |
| TSLA   | 234.90 | 15       | 2024-06-01 13:03:00 |

---

## 🧪 Local Setup

```bash
# Clone the repo
git clone https://github.com/yourname/tradebridge.git

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
mvn spring-boot:run
```

> PostgreSQL should be running with a `trades` and `users` table configured.

---

## 🧑‍🎓 Credits

Made with ❤️ by **Aviral Srivastava**
[![GitHub](https://img.shields.io/badge/GitHub-Aviral--Srivastava-blue?logo=github)](https://github.com/meaviral17)

