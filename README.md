DNIF Matrix-AI — SOC Ticket First-Response Generator

An internal tool that helps Technical Support Engineers draft the first response to SIEM/SOC support tickets in seconds instead of minutes — using a locally-hosted LLM so no ticket data ever leaves the machine.

Built after handling hundreds of Jira tickets across incident, service request, and feature-request categories in a live SIEM support role, this tool encodes that first-response pattern into a repeatable, template-driven generator.

Why this exists

Support engineers re-type structurally similar first responses dozens of times a day — acknowledging the issue, setting expectations, asking for the right diagnostic info — with only the specifics changing per ticket. This tool automates that first draft while keeping a human in the loop to review and send.

Features
Context-aware generation — feed in ticket type, priority, customer, title, and description; get a drafted first response streamed back in real time
Template engine — first-response structure is driven by editable JSON templates keyed by ticket type + priority (P1–P4), so tone and required fields can be tuned per SLA tier without touching code
Few-shot example store — a small library of past ticket → response pairs is automatically pulled in as few-shot context for the LLM, so output style matches real support responses
Local-first / private by design — runs entirely against a local Ollama (Mistral 7B) instance; no ticket content is sent to a third-party API
Live streaming UI — responses render token-by-token via a streaming API, with a live backend/model health indicator in the sidebar
Tech Stack

Frontend: React 18, React Router 6, Tailwind CSS, Vite, lucide-react Backend: FastAPI, Pydantic, httpx (async streaming), served over REST LLM: Ollama running Mistral 7B locally Data: JSON-based template store + example store (no external DB required)

Architecture
┌─────────────┐      REST/SSE       ┌──────────────┐      HTTP stream     ┌──────────────┐
│   React UI   │ ──────────────────▶ │   FastAPI    │ ───────────────────▶ │ Ollama (LLM) │
│ (Vite/Tailwind) │ ◀────────────── │  Backend     │ ◀─────────────────── │ Mistral 7B   │
└─────────────┘   streamed tokens   └──────────────┘    streamed tokens   └──────────────┘
                                            │
                                            ▼
                                  templates/ + examples store
                                  (JSON, per ticket type & SLA)
User fills in ticket metadata + description in the Generator page.
Frontend POSTs to /generate; backend selects the matching template (by ticket type + priority) and pulls the 3 most relevant few-shot examples.
prompt_builder assembles a single prompt from template + examples + ticket context.
Backend streams the Ollama response back to the UI as it's generated (StreamingResponse / token-by-token render).
Templates and Examples pages let engineers manage the underlying prompt library without redeploying.
Getting Started
Prerequisites
Node.js 18+
Python 3.10+
Ollama installed locally with the mistral model pulled: ollama pull mistral
Backend
bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
Frontend
bash
cd frontend
npm install
npm run dev

The app expects the backend on http://localhost:8000 and Ollama on http://localhost:11434.

Project Structure
dnif-ai/
├── backend/
│   ├── main.py             # FastAPI app & routes
│   ├── ollama_client.py    # Streaming client for local LLM
│   ├── prompt_builder.py   # Assembles prompt from template + examples + ticket
│   ├── template_engine.py  # CRUD for JSON response templates
│   └── examples_store.py   # CRUD for few-shot example library
└── frontend/
    └── src/
        ├── App.jsx          # Layout, routing, live health check
        └── pages/
            ├── Generator.jsx  # Main ticket → response generator UI
            ├── Templates.jsx  # Manage prompt templates
            └── Examples.jsx   # Manage few-shot examples
Roadmap
 Add authentication for multi-engineer use
 Direct Jira API integration (pull ticket, push drafted response as a comment)
 Swap Ollama for a configurable model backend (local or hosted)
 Add automated tests for prompt_builder and template_engine
