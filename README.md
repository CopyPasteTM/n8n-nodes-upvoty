# n8n-nodes-upvoty

n8n community node for [Upvoty](https://upvoty.com) — feedback management platform.

Manage feedback, changelogs, roadmaps, and users directly from your n8n workflows.

## Installation

In your n8n instance, go to **Settings → Community Nodes** and install:

```
n8n-nodes-upvoty
```

Or install via CLI:

```bash
npm install n8n-nodes-upvoty
```

## Setup

1. In n8n, go to **Credentials → New Credential → Upvoty OAuth2 API**
2. Click **Connect** — you'll be redirected to Upvoty to authorize access
3. Select your project and approve — done

## Nodes

### Upvoty

Perform actions on your Upvoty project:

- **Feedback** — Create, Get, List, Update, Delete, Change Status, Archive/Unarchive
- **Feedback Comments** — Create, List, Delete
- **Feedback Votes** — Add, Remove, List
- **Changelog** — Create, Get, List, Update, Delete, Publish, Unpublish
- **Roadmap** — Create, Get, List, Update, Delete
- **Users** — Create, Get, List, Update

Dynamic dropdowns for categories, statuses, and tags — no need to look up IDs manually.

### Upvoty Trigger

Receive real-time events from Upvoty via webhooks. Supports 55 event types including:

- Feedback created, updated, deleted, status changed
- Votes and comments added
- Changelog published
- Roadmap items updated
- And more

## Resources

- [Upvoty API Documentation](https://api.upvotyfeedback.com/docs)
- [Upvoty Website](https://upvoty.com)

## License

MIT
