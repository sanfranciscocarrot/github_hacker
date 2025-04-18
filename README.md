# Interstellar Trade Simulator

A web application that simulates interstellar trade with relativistic effects, based on Paul Krugman's "Theory of Interstellar Trade" paper.

## Features

1. Interactive interstellar map showing planet positions and ship trajectories
2. Trade simulation with relativistic interest rate calculations
3. Real-time ship tracking during transit
4. RAG-powered chat interface for planet information
5. Physics-based calculations for time dilation and relativistic effects

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js backend API
- `shared/` - Shared TypeScript types and utilities

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Start development servers:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Technical Stack

- Frontend: React, TypeScript, Three.js (for 3D visualization)
- Backend: Node.js, Express, TypeScript
- Database: MongoDB (for storing trade history and planet data)
- RAG Framework: LangChain (for chat interface) 