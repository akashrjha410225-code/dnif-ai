#!/bin/bash
echo "Starting DNIF AI Locally..."
echo "=========================="

echo "[1/3] Starting Ollama..."
ollama serve &
sleep 3

echo "[2/3] Starting Python Backend..."
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000 &
cd ..
sleep 3

echo "[3/3] Starting React Frontend..."
cd frontend
npm install
npm run dev