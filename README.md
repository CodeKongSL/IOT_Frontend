# IoT Dashboard

Premium, real-time IoT dashboard built with React, Vite, and Tailwind CSS. It streams sensor updates over WebSocket, displays live cards, trend chart, and a telemetry table, and supports instant filtering and search.

## Features

- Real-time WebSocket updates
- Glassmorphism dashboard layout
- Live cards, line chart, and telemetry table
- Filter by temperature, humidity, and time window
- Frontend search across timestamps and values
- Dark/light mode toggle

## Setup

```bash
npm install
npm run dev
```

## Data Sources

- WebSocket: `ws://localhost:8080/ws`
- API base: `http://localhost:8080/api`
	- `GET /data`
	- `GET /history`
	- `GET /search`

## Project Structure

```
src/
	common/
	components/
	dashboard/
	hooks/
	layouts/
	pages/
	services/
	store/
	utils/
```
