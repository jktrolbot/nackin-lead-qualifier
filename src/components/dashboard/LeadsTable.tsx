'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadData, ChatMessage } from '@/types';
import { getScoreBadgeVariant, getScoreEmoji } from '@/lib/scoring';
import { format } from 'date-fns';
import { Search, Eye, Trash2, Mail, Building2, DollarSign, MessageSquare, Bot, User } from 'lucide-react';

interface LeadsTableProps {
  leads: LeadData[];
  onRefresh: () => void;
}

export function LeadsTable({ leads, onRefresh }: LeadsTableProps) {
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = leads.filter(lead => {
    if (scoreFilter !== 'all' && lead.scoreLabel !== scoreFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.company || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function deleteLead(id: string) {
    setIsDeleting(id);
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(null);
    }
  }

  function ScoreBadge({ lead }: { lead: LeadData }) {
    const label = lead.scoreLabel || 'unqualified';
    const emoji = getScoreEmoji(label);
    return (
      <div className="flex items-center gap-1.5">
        <Badge
          variant={getScoreBadgeVariant(label)}
          className="text-xs capitalize"
        >
          {emoji} {label}
        </Badge>
        <span className="text-xs text-muted-foreground">{lead.score}/100</span>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="Filter by score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All leads</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">⚡ Warm</SelectItem>
            <SelectItem value="cold">❄️ Cold</SelectItem>
            <SelectItem value="unqualified">👤 Unqualified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-xs">Lead</TableHead>
              <TableHead className="font-semibold text-xs hidden md:table-cell">Company</TableHead>
              <TableHead className="font-semibold text-xs hidden lg:table-cell">Need</TableHead>
              <TableHead className="font-semibold text-xs hidden sm:table-cell">Budget</TableHead>
              <TableHead className="font-semibold text-xs">Score</TableHead>
              <TableHead className="font-semibold text-xs hidden md:table-cell">Date</TableHead>
              <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No leads found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(lead => (
                <TableRow key={lead.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{lead.name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {lead.email || 'No email'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {lead.company || '—'}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {lead.need || '—'}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {lead.budget || '—'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <ScoreBadge lead={lead} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-xs text-muted-foreground">
                      {lead.createdAt ? format(new Date(lead.createdAt), 'MMM dd, HH:mm') : '—'}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => lead.id && deleteLead(lead.id)}
                        disabled={isDeleting === lead.id}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Showing {filtered.length} of {leads.length} leads
      </p>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{getScoreEmoji(selectedLead?.scoreLabel || 'unqualified')}</span>
              <span>{selectedLead?.name || 'Lead Detail'}</span>
              {selectedLead && (
                <Badge variant={getScoreBadgeVariant(selectedLead.scoreLabel || 'unqualified')} className="ml-2">
                  {selectedLead.score}/100
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-4">
                {/* Lead info grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Email', value: selectedLead.email, icon: Mail },
                    { label: 'Company', value: selectedLead.company, icon: Building2 },
                    { label: 'Budget', value: selectedLead.budget, icon: DollarSign },
                    { label: 'Date', value: selectedLead.createdAt ? format(new Date(selectedLead.createdAt), 'PPpp') : '—', icon: MessageSquare },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-muted/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Icon className="w-3 h-3" />
                        {label}
                      </p>
                      <p className="text-sm font-medium">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Need */}
                {selectedLead.need && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Project Need</p>
                    <p className="text-sm">{selectedLead.need}</p>
                  </div>
                )}

                {/* Transcript */}
                {selectedLead.transcript && Array.isArray(selectedLead.transcript) && selectedLead.transcript.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Chat Transcript
                    </p>
                    <div className="space-y-2">
                      {(selectedLead.transcript as ChatMessage[]).map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'
                          }`}>
                            {msg.role === 'user'
                              ? <User className="w-3 h-3 text-white" />
                              : <Bot className="w-3 h-3 text-white" />
                            }
                          </div>
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-tr-sm'
                              : 'bg-muted text-foreground rounded-tl-sm'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
