# 🤖 AI Lead Qualification Chatbot

> Qualify leads automatically with conversational AI. Built with GPT-4o, Next.js 15, and shadcn/ui.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black)](https://ui.shadcn.com)

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

## 🚀 Live Demo

- **Chatbot**: [nackin-lead-qualifier.vercel.app](https://nackin-lead-qualifier.vercel.app)
- **Dashboard**: [nackin-lead-qualifier.vercel.app/dashboard](https://nackin-lead-qualifier.vercel.app/dashboard)

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
- Budget $10k+: +45 pts / $3k-$9k: +25 pts / <$3k: +5 pts
- Urgency detected: +10 pts

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

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/jktrolbot/nackin-lead-qualifier
cd nackin-lead-qualifier
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Webhook (optional)
WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 3. Supabase Setup

Run this SQL in your Supabase project:

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

-- Enable Row Level Security
alter table leads enable row level security;
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 🔌 Embed Widget

Add to any website:

```html
<!-- Add to your site's <head> -->
<script>
  window.LEAD_QUALIFIER_URL = 'https://your-deployment.vercel.app';
</script>
<script src="https://your-deployment.vercel.app/embed.js" async></script>
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Chat + lead extraction
│   │   ├── leads/route.ts       # CRUD for leads
│   │   ├── leads/[id]/route.ts  # Individual lead ops
│   │   └── metrics/route.ts     # Dashboard metrics
│   ├── dashboard/
│   │   └── page.tsx             # Admin dashboard
│   ├── layout.tsx
│   └── page.tsx                 # Landing + chatbot
├── components/
│   ├── chatbot/
│   │   └── ChatWidget.tsx       # Floating chat widget
│   ├── dashboard/
│   │   ├── MetricsCards.tsx     # KPI cards
│   │   ├── LeadsChart.tsx       # Recharts visualizations
│   │   └── LeadsTable.tsx       # Lead list + detail dialog
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── scoring.ts               # Lead scoring logic
│   ├── store.ts                 # In-memory store (demo)
│   └── supabase.ts              # Supabase client
└── types/
    └── index.ts                 # TypeScript types
```

## 🤝 Built for Upwork Portfolio

This project demonstrates:
- Full-stack Next.js 15 development
- AI integration with OpenAI GPT-4o
- Professional UI with shadcn/ui + Tailwind
- TypeScript best practices
- Production deployment with Vercel
- Database design with Supabase
- Real-time data visualization

---

Built by [@jktrolbot](https://github.com/jktrolbot) · [nackin-lead-qualifier.vercel.app](https://nackin-lead-qualifier.vercel.app)
