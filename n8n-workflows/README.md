# n8n Automated Workflows for Disaster Relief Coordination

This directory contains production-ready **n8n automation workflows** designed to connect your **Disaster Relief Application** to emergency communication channels (Telegram, Slack, WhatsApp, SMS, and Email).

---

## 🚀 Workflow Overview: `disaster_relief_n8n_workflow.json`

### 1. Real-Time Critical Incident Dispatch
```text
Relief Operator submits Request (React UI / API)
    │
    ▼ HTTP Webhook
n8n Webhook Trigger (`POST /webhook/relief-request`)
    │
    ▼ IF Node
Priority == 'CRITICAL' OR isMainAgendaFocus == true
    │
    ├─► YES: Call Auto-Allocation Engine (`POST /api/v1/dashboard/calculate-allocations`)
    │         │
    │         ▼
    │   Send Urgent Telegram / WhatsApp Dispatch Alert to Fleet Convoy
    │
    └─► NO: Log to archive spreadsheet / dashboard
```

### 2. Daily 8:00 AM Main Mission Agenda Broadcast
```text
Daily 8:00 AM Cron Schedule Trigger
    │
    ▼ HTTP Request
Fetch Today's Main Agenda & Gap Summary (`GET /api/v1/dashboard/gaps`)
    │
    ▼ Formatting
Generate Markdown Mission Briefing
    │
    ▼ Broadcast
Post to Emergency Response Slack Channel (`#daily-relief-briefing`) & Telegram Command Group
```

---

## 📥 How to Import into n8n

1. Start your n8n instance (Cloud, Desktop, or Docker: `docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n`).
2. Open n8n in your browser (`http://localhost:5678`).
3. Create a new workflow.
4. Press **`Ctrl + V`** (or **`Cmd + V`** on Mac) or click **Menu → Import from File** and select `disaster_relief_n8n_workflow.json`.
5. The entire workflow with Webhook, Condition, Auto-Allocation Action, and Notification nodes will instantly appear on your canvas!
6. Click **Activate Workflow**.

---

## ⚙️ Webhook Integration

The workflow listens on:
```text
POST http://localhost:5678/webhook/relief-request
```
Whenever a relief operator submits a critical request, the webhook dispatches the incident payload to your alert channels automatically.
