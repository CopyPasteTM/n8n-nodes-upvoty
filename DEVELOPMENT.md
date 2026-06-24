# n8n Node — Development Guide

Internal guide for developing and testing the Upvoty n8n community node.

## Prerequisites

```bash
npm install -g n8n

mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm init -y
```

## Build & Link

```bash
cd packages/n8n
npm install
npm run build

npm link

cd ~/.n8n/custom
npm link n8n-nodes-upvoty
```

## Run

```bash
n8n start
# Open http://localhost:5678, search for "Upvoty"
```

## Development Workflow

```bash
# Terminal 1: Watch mode
cd packages/n8n
npm run dev

# Terminal 2: Run n8n (restart after each recompile)
n8n start
```

No hot reload — restart n8n after each rebuild. If you change the SVG icon, run `npm run build` once.

## Docker Alternative

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_CUSTOM_EXTENSIONS=/custom-nodes/n8n-nodes-upvoty
    volumes:
      - n8n_data:/home/node/.n8n
      - ./packages/n8n:/custom-nodes/n8n-nodes-upvoty

volumes:
  n8n_data:
```

## Testing Webhooks Locally

n8n generates webhook URLs like `http://localhost:5678/webhook/...`. If Upvoty is remote, use ngrok:

```bash
ngrok http 5678
```

## Testing Checklist

- [ ] OAuth2: connect → consent page → tokens stored
- [ ] OAuth2: token expires → auto-refreshes on next request
- [ ] Trigger: activate → webhook created, deactivate → deleted
- [ ] Trigger: event fires → workflow runs with correct payload
- [ ] All CRUD operations for each resource
- [ ] Dynamic dropdowns load correctly
- [ ] Error handling: 404, 422, 429
- [ ] Pagination: "Return All" fetches all pages
