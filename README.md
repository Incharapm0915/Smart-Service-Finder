# 📍 Smart Public Service Finder

A full-stack web application that helps users quickly locate nearby
essential public services like hospitals, ATMs, police stations,
restaurants, and more — using real-time location and map integration.

---

## 🚀 Live Demo
> Run locally using the steps below

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite                   |
| Routing    | React Router DOM v6               |
| State      | React Context API + localStorage  |
| Map        | Leaflet.js + React-Leaflet        |
| Places API | Overpass API (OpenStreetMap)      |
| Geocoding  | Nominatim (OpenStreetMap)         |
| Styling    | Plain CSS (Responsive)            |

---

## ✨ Features

### Core
- 📍 Auto detect user location via browser GPS
- ✍️ Manual location input with geocoding
- 🗺️ Interactive map with markers for all results
- 📋 Scrollable list view with distance info
- 🔍 Filter results by name in real time
- 🔃 Sort by distance or name
- 📄 Details page with address, phone, website, hours
- ❤️ Save/remove favorites (persisted in localStorage)

### Bonus
- 🌙 Dark mode toggle (persisted across sessions)
- 🚨 Emergency quick access (Hospital & Police)
- 🎤 Voice search for location input
- 🔢 Favorites count badge in navbar
- 📱 Fully responsive for mobile

---

## 🗺️ APIs Used

| API           | Purpose                        | Cost  |
|---------------|--------------------------------|-------|
| Nominatim     | Location name → coordinates    | Free  |
| Overpass API  | Fetch nearby places by type    | Free  |
| Browser GeoAPI| Detect current GPS location    | Free  |
| Leaflet.js    | Render interactive map         | Free  |

---

## 📁 Project Structure

\`\`\`
smart-service-finder/
├── public/
└── src/
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Navbar.css
    │   ├── EmergencyButton.jsx
    │   └── EmergencyButton.css
    ├── context/
    │   └── AppContext.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Results.jsx
    │   ├── Details.jsx
    │   └── Favorites.jsx
    ├── services/
    │   └── api.js
    ├── styles/
    │   ├── Home.css
    │   ├── Results.css
    │   ├── Details.css
    │   └── Favorites.css
    ├── App.jsx
    ├── main.jsx
    └── index.css
\`\`\`

---

## ⚙️ Setup Steps

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/smart-service-finder.git
cd smart-service-finder
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open in browser
\`\`\`
http://localhost:5173
\`\`\`

> ⚠️ No API keys required — all APIs are free and open

---

## 📊 Evaluation Criteria Coverage

| Criteria         | Marks | Implementation                              |
|------------------|-------|---------------------------------------------|
| API Integration  | 20    | Overpass API + Nominatim + Browser GeoAPI   |
| React Routing    | 20    | React Router v6 — 4 pages with dynamic route|
| State Management | 20    | Context API + useState + localStorage       |
| UI/UX Design     | 15    | Responsive CSS + Dark mode + Clean layout   |
| Functionality    | 15    | Search, filter, sort, favorites, details    |
| Innovation       | 10    | Voice search + Emergency button + Dark mode |
| **Total**        | **100**|                                            |

---

## 👨‍💻 Author
- **Name:** Inchara
- **College:** BIET, Davanagere
- **Department:** AI & ML
- **Year:** Final Year B.E.