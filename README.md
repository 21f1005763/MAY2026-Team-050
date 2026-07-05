# Jan Setu

FastAPI backend for Jan Setu WhatsApp Business send/receive flows.

## Features

- WhatsApp Business send/receive flows with an auto-reply conversation engine
- A React + TypeScript citizen web portal with reverse-OTP WhatsApp-based login
- An LLM-driven complaint pipeline: Sarvam speech-to-text, OpenRouter-based
  classification, and image-match checking via free models
- A dedup window for non-priority complaints (priority categories skip it)
- Department dispatch via a mock API or SMTP (Mailpit locally)

## What Runs Locally

- `api`: FastAPI app on `http://localhost:8000`
- `postgres`: local PostgreSQL database on port `5432`
- `mailpit`: local-only SMTP inbox with a web UI on `http://localhost:8025`,
  used when `DISPATCHER=smtp`
- `tunnel`: optional Cloudflare tunnel for WhatsApp webhook testing

## Docker Profiles

| Profile | Purpose | Runs in Docker |
| --- | --- | --- |
| `dev` | Daily development and WhatsApp webhook testing | PostgreSQL, `worker-dev`, Mailpit, Cloudflare tunnel |
| `prod` | Local production-like demo only | PostgreSQL, API, worker, frontend/Nginx, Mailpit |

`prod` is **not** an Azure deployment recipe. Azure replaces local PostgreSQL and
Mailpit with managed PostgreSQL plus a real email delivery service. The temporary
dev tunnel is intentionally excluded from `prod`.

## Run Locally — Full Application

Use this path to run the database, API, worker, frontend, and local email inbox together.

### Prerequisites

Install once:

- Docker Desktop, running
- Git

For the Docker workflow below, Python, `uv`, and Node.js are **not** required on the host.

