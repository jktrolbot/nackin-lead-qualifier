'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, LeadData } from '@/types';
import { getScoreEmoji } from '@/lib/scoring';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoringResult {
  score: number;
  label: 'hot' | 'warm' | 'cold' | 'unqualified';
  reasons: string[];
}

function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<Partial<LeadData>>({});
  const [scoring, setScoring] = useState<ScoringResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [hasUnread, setHasUnread] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show unread indicator after 3 seconds if chat hasn't been opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasUnread(prev => (isOpen ? false : prev || true));
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendGreeting = useCallback(async (sid: string) => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], sessionId: sid }),
      });
      const data = await res.json() as { content?: string };
      setMessages([
        {
          role: 'assistant',
          content: data.content ?? "Hi! I'm here to learn about your project. What are you looking to build? 👋",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm here to learn about your project. What are you looking to build? 👋",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  // Focus input and send greeting when chat opens
  useEffect(() => {
    if (!isOpen) return;
    setHasUnread(false);
    setTimeout(() => inputRef.current?.focus(), 100);
    if (messages.length === 0) {
      sendGreeting(sessionId);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  // ↑ Intentional: we only want this to run when isOpen toggles.
  //   sendGreeting is stable (useCallback), sessionId set once at mount.

  function resetChat() {
    const newSid = generateSessionId();
    setSessionId(newSid);
    setMessages([]);
    setLeadData({});
    setScoring(null);
    setIsComplete(false);
    setInput('');
    sendGreeting(newSid);
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId,
          existingLead: leadData,
        }),
      });

      const data = await res.json() as {
        content: string;
        leadData?: Partial<LeadData>;
        scoring?: ScoringResult;
        complete?: boolean;
      };

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.content, timestamp: new Date().toISOString() },
      ]);

      if (data.leadData) setLeadData(data.leadData);
      if (data.scoring)  setScoring(data.scoring);
      if (data.complete) setIsComplete(true);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const scoreEmoji = scoring ? getScoreEmoji(scoring.label) : null;

  return (
    <>
      {/* ── Chat bubble button ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300',
            'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
            'hover:scale-110 active:scale-95',
            isOpen && 'rotate-12',
          )}
          aria-label="Open chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-300" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">1</span>
            </span>
          )}
        </button>

        {/* Pulse ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 pointer-events-none" />
        )}
      </div>

      {/* ── Chat window ────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-1.5rem)]',
          'transition-all duration-300 origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none',
        )}
      >
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Project Assistant</p>
              <p className="text-indigo-200 text-xs">Online · Usually replies instantly</p>
            </div>
            {scoring && (
              <Badge variant="outline" className="text-white border-white/30 text-xs">
                {scoreEmoji} {scoring.score}/100
              </Badge>
            )}
            {(isComplete || messages.length > 0) && (
              <button
                onClick={resetChat}
                className="text-white/60 hover:text-white transition-colors"
                title="Start new conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-2 animate-in slide-in-from-bottom-2 duration-300',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                      msg.role === 'user'
                        ? 'bg-indigo-600'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-600',
                    )}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      'max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm',
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 items-center animate-in slide-in-from-bottom-2 duration-300">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Completion card */}
              {isComplete && scoring && (
                <div className="animate-in slide-in-from-bottom-2 duration-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-800 dark:text-green-300 text-sm">
                      Lead Qualified!
                    </p>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    {scoreEmoji} Score: <strong>{scoring.score}/100</strong> (
                    {scoring.label.toUpperCase()})
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    We&apos;ll be in touch soon! 🚀
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="p-3 border-t border-border bg-background/50 backdrop-blur-sm">
            {isComplete ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-center text-xs text-muted-foreground">
                  ✅ Thank you! We&apos;ll contact you shortly.
                </p>
                <button
                  onClick={resetChat}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start a new conversation
                </button>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  disabled={isLoading}
                  className="flex-1 h-10 text-sm border-border/50 focus-visible:ring-indigo-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
