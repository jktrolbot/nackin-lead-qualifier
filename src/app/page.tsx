import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  MessageCircle,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  Github,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: MessageCircle,
    title: 'Conversational AI',
    description:
      'GPT-4o powered chatbot that engages visitors naturally and extracts key information without feeling like a form.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Zap,
    title: 'Instant Lead Scoring',
    description:
      'Every conversation is scored in real-time. Hot leads get immediate notifications so you never miss a hot prospect.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track leads over time, see conversion rates, and analyse your pipeline with beautiful charts.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Data stored securely in Supabase. GDPR compliant. No third-party tracking.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
];

const techStack = [
  'Next.js 15',
  'TypeScript',
  'Tailwind CSS',
  'shadcn/ui',
  'GPT-4o',
  'Supabase',
  'Recharts',
  'Vercel',
];

const scores = [
  {
    label: '🔥 Hot',
    range: '70–100',
    desc: 'High budget + clear need + contact info',
    color: 'text-red-600 bg-red-500/10 border-red-200 dark:border-red-900',
  },
  {
    label: '⚡ Warm',
    range: '40–69',
    desc: 'Some qualification but missing key info',
    color: 'text-orange-600 bg-orange-500/10 border-orange-200 dark:border-orange-900',
  },
  {
    label: '❄️ Cold',
    range: '10–39',
    desc: 'Low budget or minimal engagement',
    color: 'text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-900',
  },
];

const scoringFactors = [
  'Email provided (+20)',
  'Name provided (+10)',
  'Company identified (+15)',
  'Clear project need (+10)',
  'High budget $10k+ (+45)',
  'Urgency detected (+10)',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">LeadQualifier</span>
            <Badge variant="outline" className="text-xs ml-1 hidden sm:flex">
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 h-8 text-xs bg-indigo-600 hover:bg-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <Badge className="mb-4 bg-indigo-600/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Lead Qualification
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Qualify leads while
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              you sleep
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            An embeddable AI chatbot that naturally converses with your visitors, qualifies them
            automatically, and sends instant alerts for hot leads. Built with GPT-4o for
            next-level conversations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Link href="/dashboard">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg shadow-indigo-500/25">
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="#chatbot">
                <MessageCircle className="w-4 h-4" />
                Try the chatbot →
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 animate-in fade-in duration-1000 delay-700">
            👇 Click the chat bubble in the bottom right to try it live!
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Everything you need to qualify leads
            </h2>
            <p className="text-muted-foreground">
              From first contact to qualified prospect in minutes
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <Card
                key={title}
                className="border-border/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 group"
              >
                <CardContent className="pt-6">
                  <div
                    className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring section */}
      <section id="scoring" className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">Smart Lead Scoring</h2>
            <p className="text-muted-foreground text-sm">
              Every lead gets a score based on configurable criteria
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scores.map(({ label, range, desc, color }) => (
              <div key={label} className={`rounded-xl p-5 ${color} border`}>
                <p className="text-lg font-bold mb-1">{label}</p>
                <p className="font-mono text-sm font-semibold mb-2">{range} pts</p>
                <p className="text-xs opacity-80">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-background rounded-xl p-5 border border-border/50">
            <h3 className="font-semibold text-sm mb-3">Scoring factors:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scoringFactors.map(factor => (
                <div key={factor} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {factor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="tech" className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-6">Built with modern tech</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {techStack.map(tech => (
              <Badge key={tech} variant="outline" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to automate your lead qualification?
          </h2>
          <p className="text-indigo-200 mb-8 text-sm">
            Try the live demo in the bottom-right corner, or view the admin dashboard.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">LeadQualifier</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built by{' '}
            <a
              href="https://github.com/jktrolbot"
              className="text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              @jktrolbot
            </a>{' '}
            ·{' '}
            <a
              href="https://lead-qualifier-red.vercel.app"
              className="text-indigo-600 hover:underline"
            >
              lead-qualifier-red.vercel.app
            </a>
          </p>
        </div>
      </footer>

      {/* Chatbot widget */}
      <ChatWidget />
    </div>
  );
}
