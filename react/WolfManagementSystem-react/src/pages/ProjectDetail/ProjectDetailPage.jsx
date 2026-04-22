import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Tag, FolderKanban, MessageSquare, Send, Plus, ChevronRight, Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// ─── Mock data (replace with real API calls later) ───────────────────────────
const MOCK_PROJECT = {
  id: 1,
  name: 'Wolf Management System',
  description:
    'A full-stack project management platform with real-time chat, issue tracking, subscriptions, and team collaboration built with Spring Boot and React.',
  category: 'Fullstack',
  tags: ['React', 'Spring Boot', 'MySQL', 'Docker'],
  owner: { id: 1, fullName: 'Soham Patel', email: 'soham@example.com' },
  team: [
    { id: 1, fullName: 'Soham Patel', email: 'soham@example.com' },
    { id: 2, fullName: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, fullName: 'Alex Kim', email: 'alex@example.com' },
  ],
  projectSize: 3,
};

const MOCK_ISSUES = [
  { id: 1, title: 'Set up Spring Security with JWT', status: 'Closed', priority: 'High', assignee: { fullName: 'Soham Patel' }, dueDate: '2025-03-15' },
  { id: 2, title: 'Implement project invitation via email', status: 'Closed', priority: 'Medium', assignee: { fullName: 'Jane Doe' }, dueDate: '2025-04-01' },
  { id: 3, title: 'Build React project list page with filters', status: 'In Progress', priority: 'High', assignee: { fullName: 'Alex Kim' }, dueDate: '2025-04-22' },
  { id: 4, title: 'Add Stripe payment integration', status: 'In Progress', priority: 'Medium', assignee: { fullName: 'Soham Patel' }, dueDate: '2025-05-01' },
  { id: 5, title: 'Design project detail page', status: 'Open', priority: 'Low', assignee: null, dueDate: '2025-05-10' },
  { id: 6, title: 'Write unit tests for IssueService', status: 'Open', priority: 'Medium', assignee: null, dueDate: '2025-05-20' },
];

const MOCK_MESSAGES = [
  { id: 1, sender: { fullName: 'Soham Patel' }, content: 'Hey team, the auth flow is done! Please review the JWT implementation.', createdAt: '10:14 AM' },
  { id: 2, sender: { fullName: 'Jane Doe' }, content: 'Looks great! I\'ll test it with the invitation flow today.', createdAt: '10:22 AM' },
  { id: 3, sender: { fullName: 'Alex Kim' }, content: 'I\'m finishing up the filter logic on the project list. Should be done by EOD.', createdAt: '11:05 AM' },
  { id: 4, sender: { fullName: 'Soham Patel' }, content: 'Perfect. Let\'s aim to merge everything by Friday.', createdAt: '11:08 AM' },
];
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  'Open':        { icon: Circle,        color: 'text-sky-400',    bg: 'bg-sky-400/10',    label: 'Open'        },
  'In Progress': { icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-400/10',  label: 'In Progress' },
  'Closed':      { icon: CheckCircle2,  color: 'text-emerald-400',bg: 'bg-emerald-400/10',label: 'Closed'      },
};

const PRIORITY_CONFIG = {
  'High':   { color: 'text-rose-400',   bg: 'bg-rose-400/10'   },
  'Medium': { color: 'text-amber-400',  bg: 'bg-amber-400/10'  },
  'Low':    { color: 'text-slate-400',  bg: 'bg-slate-400/10'  },
};

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const TABS = ['Overview', 'Issues', 'Chat'];

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState('Overview');
  const [issueFilter, setIssueFilter] = useState('All');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages]     = useState(MOCK_MESSAGES);

  // Use mock data for now; swap with real API calls later
  const project = MOCK_PROJECT;
  const issues  = MOCK_ISSUES;

  // ── Derived ────────────────────────────────────────────────────────────────
  const issueCounts = {
    All:          issues.length,
    Open:         issues.filter(i => i.status === 'Open').length,
    'In Progress':issues.filter(i => i.status === 'In Progress').length,
    Closed:       issues.filter(i => i.status === 'Closed').length,
  };

  const filteredIssues =
    issueFilter === 'All' ? issues : issues.filter(i => i.status === issueFilter);

  const handleSendMessage = () => {
    const content = chatMessage.trim();
    if (!content) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: { fullName: 'You' },
      content,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatMessage('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              {initials(project.name)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">{project.name}</h1>
              <p className="text-xs text-muted-foreground">{project.category} · {project.projectSize} member{project.projectSize !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <Button size="sm" className="shrink-0 gap-2">
            <Plus className="h-3.5 w-3.5" />
            New Issue
          </Button>
        </div>

        {/* ── Tabs ── */}
        <div className="mx-auto flex max-w-7xl gap-0 px-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:content-[\'\']'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {tab === 'Issues' && (
                <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {issueCounts.All}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {activeTab === 'Overview' && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Left: Project info */}
            <div className="space-y-6 lg:col-span-2">

              {/* About card */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">About</h2>
                <Separator className="mb-4 mt-2" />
                <p className="text-sm leading-relaxed text-foreground/80">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Issues',    value: issueCounts.All,           color: 'text-foreground'    },
                  { label: 'In Progress',     value: issueCounts['In Progress'], color: 'text-amber-400'    },
                  { label: 'Closed',          value: issueCounts.Closed,         color: 'text-emerald-400'  },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border bg-card p-5 shadow-sm text-center">
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent issues preview */}
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                  <h2 className="text-sm font-semibold">Recent Issues</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('Issues')} className="gap-1 text-xs text-muted-foreground">
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Separator />
                <ul>
                  {issues.slice(0, 4).map((issue, idx) => {
                    const sc  = STATUS_CONFIG[issue.status]   ?? STATUS_CONFIG['Open'];
                    const StatusIcon = sc.icon;
                    return (
                      <li
                        key={issue.id}
                        className={`flex items-center gap-4 px-6 py-3 text-sm hover:bg-muted/40 transition-colors ${idx < 3 ? 'border-b' : ''}`}
                      >
                        <StatusIcon className={`h-4 w-4 shrink-0 ${sc.color}`} />
                        <span className="flex-1 truncate">{issue.title}</span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_CONFIG[issue.priority]?.bg} ${PRIORITY_CONFIG[issue.priority]?.color}`}>
                          {issue.priority}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right: metadata */}
            <div className="space-y-6">

              {/* Category & Tags */}
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <FolderKanban className="h-3.5 w-3.5" /> Category
                  </p>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Team · {project.team.length}
                </p>
                <ul className="space-y-3">
                  {project.team.map(member => (
                    <li key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{initials(member.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{member.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      {member.id === project.owner.id && (
                        <Badge variant="outline" className="ml-auto shrink-0 text-xs">Owner</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ══════════ ISSUES TAB ══════════ */}
        {activeTab === 'Issues' && (
          <div className="space-y-5">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(issueCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setIssueFilter(status)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    issueFilter === status
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {status} <span className="ml-1 opacity-70">{count}</span>
                </button>
              ))}

              <Button size="sm" className="ml-auto gap-2">
                <Plus className="h-3.5 w-3.5" /> New Issue
              </Button>
            </div>

            {/* Issue table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              {filteredIssues.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No issues found.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3 text-left w-8">#</th>
                      <th className="px-5 py-3 text-left">Title</th>
                      <th className="px-5 py-3 text-left hidden sm:table-cell">Status</th>
                      <th className="px-5 py-3 text-left hidden md:table-cell">Priority</th>
                      <th className="px-5 py-3 text-left hidden lg:table-cell">Assignee</th>
                      <th className="px-5 py-3 text-left hidden lg:table-cell">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue, idx) => {
                      const sc = STATUS_CONFIG[issue.status] ?? STATUS_CONFIG['Open'];
                      const pc = PRIORITY_CONFIG[issue.priority] ?? PRIORITY_CONFIG['Low'];
                      const StatusIcon = sc.icon;
                      return (
                        <tr
                          key={issue.id}
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${idx < filteredIssues.length - 1 ? 'border-b' : ''}`}
                        >
                          <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">#{issue.id}</td>
                          <td className="px-5 py-3.5 font-medium">{issue.title}</td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${sc.bg} ${sc.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pc.bg} ${pc.color}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            {issue.assignee ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{initials(issue.assignee.fullName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{issue.assignee.fullName}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-muted-foreground">{issue.dueDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ══════════ CHAT TAB ══════════ */}
        {activeTab === 'Chat' && (
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 230px)', minHeight: '400px' }}>

              {/* Chat header */}
              <div className="flex items-center gap-3 border-b px-5 py-3.5">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Project Chat</span>
                <span className="ml-auto text-xs text-muted-foreground">{project.team.length} members</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-1 px-5 py-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender.fullName === 'You';
                  const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender?.fullName !== msg.sender.fullName);
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar placeholder for spacing */}
                      <div className="w-7 shrink-0">
                        {showAvatar && !isMe && (
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">{initials(msg.sender.fullName)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isMe && (
                          <span className="text-xs font-medium text-muted-foreground px-1">{msg.sender.fullName}</span>
                        )}
                        <div className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                          isMe
                            ? 'rounded-br-sm bg-primary text-primary-foreground'
                            : 'rounded-bl-sm bg-muted text-foreground'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground/60 px-1">{msg.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-xs">YO</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="h-9 w-9 shrink-0 rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};