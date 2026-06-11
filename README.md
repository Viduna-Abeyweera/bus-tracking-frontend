# 🚌 Bus Tracker SL — Frontend

> Premium React SPA for real-time bus tracking across Sri Lanka

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet)](https://leafletjs.com/)

---

## 📖 Overview

The **Bus Tracker SL Frontend** is a single-page application that provides:

- 🗺️ **Live Map** — Real-time bus tracking via WebSocket (STOMP/SockJS)
- 🔍 **Route Browser** — Search and explore all Sri Lankan bus routes with stop timelines
- 📅 **Schedule Viewer** — Departure times filtered by day-of-week
- 🚌 **Driver Dashboard** — GPS location sharing with live stats
- ⚙️ **Admin Panel** — Full CRUD management for routes, buses, and schedules
- 🔐 **JWT Authentication** — Role-based access (Passenger, Driver, Admin)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with JWT interceptor |
| **@stomp/stompjs** | WebSocket (STOMP protocol) |
| **sockjs-client** | WebSocket fallback for older browsers |
| **React-Leaflet** | Interactive map with OpenStreetMap tiles |
| **React Icons** | Feather icon set |
| **React Hot Toast** | Toast notifications |
| **Vanilla CSS** | Dark theme + glassmorphism design system |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Backend API** running at `http://localhost:8080` (see [backend repo](https://github.com/Viduna-Abeyweera/bus-tracking-system))

### Installation

```bash
# Clone the repo (if not already)
cd bus-tracking-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens at **http://localhost:5173**

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080

# WebSocket URL
VITE_WS_URL=http://localhost:8080/ws
```

For production deployment:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_WS_URL=https://your-backend.railway.app/ws
```

---

## 🏃 How to Run (Full Stack)

### Step 1: Start the Backend

```bash
cd bus-tracking-backend

# Configure database in .env or application.properties
# Make sure PostgreSQL/MySQL is running

./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`. Swagger UI at `http://localhost:8080/swagger-ui.html`.

### Step 2: Start the Frontend

```bash
cd bus-tracking-frontend
npm run dev
```

Frontend starts at `http://localhost:5173`.

### Step 3: Login

Open `http://localhost:5173` and use any seeded account:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@bustracker.lk` | `admin123` |
| 🚌 Driver | `driver1@bustracker.lk` | `driver123` |
| 🧑 Passenger | `passenger@bustracker.lk` | `passenger123` |

### Step 4: Test Features

1. **Passenger** — Login → Live Map → see buses on map → click a stop for ETA
2. **Driver** — Login → Driver Dashboard → select bus → Start Sharing Location
3. **Admin** — Login → Admin Dashboard → Manage Routes/Buses/Schedules

---

## 📁 Project Structure

```
src/
├── App.jsx                      # Router + AuthProvider + Toaster
├── main.jsx                     # Entry point
├── index.css                    # Design system (dark theme, glassmorphism)
│
├── context/
│   └── AuthContext.jsx          # JWT state management (login/register/logout)
│
├── services/
│   ├── api.js                   # Axios instance + JWT interceptor
│   └── websocket.js             # STOMP/SockJS singleton client
│
├── components/
│   ├── common/
│   │   ├── ProtectedRoute.jsx   # Auth + role guard
│   │   └── LoadingSpinner.jsx   # Animated bus spinner
│   └── layout/
│       ├── Navbar.jsx           # Glassmorphism navigation bar
│       └── Navbar.css
│
└── pages/
    ├── LandingPage.jsx          # Hero, features, route preview, CTA
    ├── LandingPage.css
    │
    ├── auth/
    │   ├── LoginPage.jsx        # JWT login with role redirect
    │   ├── RegisterPage.jsx     # Registration with role selector
    │   └── AuthPages.css
    │
    ├── passenger/
    │   ├── LiveMapPage.jsx      # Real-time WebSocket map
    │   ├── LiveMapPage.css
    │   ├── RoutesPage.jsx       # Route browser + stop timeline
    │   ├── RoutesPage.css
    │   ├── SchedulePage.jsx     # Day-of-week schedule viewer
    │   └── SchedulePage.css
    │
    ├── driver/
    │   ├── DriverDashboard.jsx  # GPS tracking + live stats
    │   └── DriverDashboard.css
    │
    └── admin/
        ├── AdminDashboard.jsx   # Stats cards + quick actions
        ├── AdminDashboard.css
        ├── ManageRoutes.jsx     # Route CRUD table
        ├── ManageBuses.jsx      # Bus management + status
        ├── ManageSchedules.jsx  # Schedule CRUD by day
        └── AdminManage.css
```

---

## 🗺️ Routing

| Path | Component | Access |
|------|-----------|--------|
| `/` | LandingPage | 🌐 Public |
| `/login` | LoginPage | 🌐 Public |
| `/register` | RegisterPage | 🌐 Public |
| `/routes` | RoutesPage | 🌐 Public |
| `/map` | LiveMapPage | 🔒 Authenticated |
| `/schedules` | SchedulePage | 🔒 Authenticated |
| `/driver` | DriverDashboard | 🔒 DRIVER / ADMIN |
| `/admin` | AdminDashboard | 🔒 ADMIN only |
| `/admin/routes` | ManageRoutes | 🔒 ADMIN only |
| `/admin/buses` | ManageBuses | 🔒 ADMIN only |
| `/admin/schedules` | ManageSchedules | 🔒 ADMIN only |

---

## 🎨 Design System

The app uses a premium dark theme with glassmorphism, defined in `index.css`.

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#6C63FF` | Buttons, active states, badges |
| `--accent` | `#00D4AA` | Success, ETA times, live indicators |
| `--bg-primary` | `#0F0E17` | Page background |
| `--bg-secondary` | `#1A1A2E` | Card backgrounds |
| `--bg-glass` | `rgba(255,255,255,0.03)` | Glass cards |
| `--glass-blur` | `blur(20px)` | Navbar, modals |
| Font | Inter (Google Fonts) | All text |

### Key UI Features

- **Glassmorphism** cards with backdrop blur
- **Gradient text** on hero headings
- **Animated bus markers** (color-coded by status)
- **Live connection indicator** (green dot + pulse animation)
- **Responsive** — works on mobile, tablet, desktop
- **Toast notifications** for all CRUD operations

---

## ⚡ WebSocket Integration

The app connects to the backend via STOMP over SockJS for real-time updates:

```
Frontend (subscriber)          Backend (publisher)
        │                              │
        ├──── CONNECT /ws?token=JWT ──►│
        │                              │
        │◄── /topic/bus-locations ─────┤  All bus position updates
        │◄── /topic/bus-locations/1 ───┤  Route-specific updates
        │◄── /topic/bus-status ────────┤  Bus status changes
        │                              │
        ├──── SEND /app/bus/location ──►│  Driver sends GPS
```

Auto-reconnect is built in — if the connection drops, it retries every 5 seconds.

---

## 📦 Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

Output is in `dist/` — deploy to **Vercel**, **Netlify**, or any static host.

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL = https://your-backend.railway.app
# VITE_WS_URL = https://your-backend.railway.app/ws
```

**Build settings:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT License — Built for SLIIT Software Engineering