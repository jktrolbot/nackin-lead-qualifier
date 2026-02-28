# 🤖 AI Lead Qualification Chatbot

> Qualify leads automatically with conversational AI. Embeddable chat widget + admin dashboard with analytics.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://nackin-lead-qualifier.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

> ⚠️ **Demo Version** — Based on a production system built for a real client. Sensitive data and proprietary business logic have been removed.

---

![App Screenshot](./public/screenshot.png)

---

## 🎯 What it does

An embeddable AI chatbot widget that:
1. **Converses naturally** with website visitors using GPT-4o
2. **Extracts key info**: name, email, company, project need, budget
3. **Scores leads automatically**: Hot 🔥 / Warm ⚡ / Cold ❄️ based on configurable criteria
4. **Saves to database**: Supabase with full transcript storage
5. **Sends hot lead alerts**: Webhook/email notifications when 🔥 Hot leads are detected

Plus an **admin dashboard** with:
- Lead list with filtering (score, date, search)
- Lead detail view with full chat transcript
- Analytics: leads/day chart, score distribution, conversion rate

---

## ✨ Features

- 💬 **Floating chat bubble** with smooth animations and unread indicator
- 🧠 **GPT-4o powered** — natural, context-aware conversations
- 📊 **Real-time scoring** — visible score during conversation
- 🎯 **Smart extraction** — name, email, company, need, budget
- 📈 **Analytics charts** — area chart + pie chart with Recharts
- 🌙 **Dark mode** support
- 📱 **Mobile responsive**
- ⚡ **Loading states** and error handling throughout
- 🔔 **Hot lead webhooks** — instant notifications

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  ┌────────────────┐  ┌───────────────────────────────────┐  │
│  │  Landing Page  │  │      Admin Dashboard              │  │
│  │  + ChatWidget  │  │  MetricsCards + Charts + Table    │  │
│  └───────┬────────┘  └──────────────┬────────────────────┘  │
│          │                          │                        │
│          ▼                          ▼                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Next.js API Routes                  │  │
│  │  /api/chat  /api/leads  /api/leads/[id]  /api/metrics │  │
│  └────────────────────────┬──────────────────────────────┘  │
└───────────────────────────│─────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              │                            │
         ┌────▼────┐                  ┌────▼────┐
         │  OpenAI │                  │Supabase │
         │  GPT-4o │                  │  leads  │
         └─────────┘                  └─────────┘
```

---

## 📊 Lead Scoring

| Score | Label | Criteria |
|-------|-------|----------|
| 70-100 | 🔥 Hot | High budget ($10k+) + email + company |
| 40-69 | ⚡ Warm | Medium budget or missing some info |
| 10-39 | ❄️ Cold | Low budget or minimal engagement |
| 0-9 | 👤 Unqualified | No useful info gathered |

**Scoring factors:**
- Email provided: +20 pts
- Name provided: +10 pts
- Company identified: +15 pts
- Clear project need: +10 pts
- Budget $10k+: +45 pts / $3k–$9k: +25 pts / <$3k: +5 pts
- Urgency detected: +10 pts

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + shadcn/ui |
| AI | OpenAI GPT-4o |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| Deployment | Vercel |
| Icons | Lucide React |

---

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/nackin-io/nackin-lead-qualifier
cd nackin-lead-qualifier
npm install
```

### 2. Environment Variables

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
WEBHOOK_URL=https://hooks.slack.com/services/...  # optional
```

### 3. Supabase Setup

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  company text,
  need text,
  budget text,
  score integer default 0,
  score_label text default 'unqualified',
  transcript jsonb,
  notified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table leads enable row level security;
```

### 4. Run

```bash
npm run dev
```

---

## 🔌 Embed Widget

```html
<script>
  window.LEAD_QUALIFIER_URL = 'https://your-deployment.vercel.app';
</script>
<script src="https://your-deployment.vercel.app/embed.js" async></script>
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── leads/route.ts
│   │   ├── leads/[id]/route.ts
│   │   └── metrics/route.ts
│   ├── dashboard/page.tsx
│   └── page.tsx
├── components/
│   ├── chatbot/ChatWidget.tsx
│   ├── dashboard/
│   │   ├── MetricsCards.tsx
│   │   ├── LeadsChart.tsx
│   │   └── LeadsTable.tsx
│   └── ui/
├── lib/
│   ├── scoring.ts
│   ├── store.ts
│   └── supabase.ts
└── types/index.ts
```

---

## 📄 License

MIT

---

> Built by [**Nackin**](https://nackin.io) — AI Engineering & Full-Stack Development Studio
