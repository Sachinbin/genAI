import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bot, Menu, MessageSquare, Plus, Send, Sparkles, SquarePen, Trash2, UserRound, X } from 'lucide-react';
import apiInstance from '../../utils/axiosInstance';
import { useCurrentUser, useLogout } from '../../hooks/useAuth';

const suggestions = [
  'Help me plan a productive week',
  'Explain a tricky topic simply',
  'Write a first draft for an idea',
];

function readConversations() {
  try { return JSON.parse(localStorage.getItem('chat-conversations') || '[]'); }
  catch { return []; }
}

export default function Dashboard() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(readConversations);
  const [activeId, setActiveId] = useState(() => readConversations()[0]?.id ?? null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const endRef = useRef(null);
  const active = conversations.find((chat) => chat.id === activeId);
  const messages = active?.messages ?? [];

  useEffect(() => { localStorage.setItem('chat-conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  const updateMessages = (id, next) => setConversations((items) => items.map((chat) => chat.id === id ? { ...chat, messages: next } : chat));

  const sendMessage = async (value = input) => {
    const content = value.trim();
    if (!content || busy) return;
    const id = activeId || crypto.randomUUID();
    const prior = active?.messages ?? [];
    const next = [...prior, { role: 'user', content }, { role: 'assistant', content: '' }];
    if (!active) {
      setConversations((items) => [{ id, title: content.slice(0, 42), messages: next }, ...items]);
      setActiveId(id);
    } else updateMessages(id, next);
    setInput(''); setBusy(true); setError(''); setMobileOpen(false);
    try {
      const response = await fetch(`${apiInstance.defaults.baseURL}/ai/chat`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(0, -1) }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw Object.assign(new Error(payload.message || 'The assistant could not respond.'), { response: { data: payload } });
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        updateMessages(id, [...next.slice(0, -1), { role: 'assistant', content: answer }]);
      }
      answer += decoder.decode();
      updateMessages(id, [...next.slice(0, -1), { role: 'assistant', content: answer }]);
    } catch (err) {
      updateMessages(id, next.slice(0, -1));
      setError(err.response?.data?.message || 'Could not reach the assistant. Check your connection and try again.');
    } finally { setBusy(false); }
  };

  const startNew = () => { setActiveId(null); setError(''); setMobileOpen(false); };
  const removeChat = (id) => {
    const remaining = conversations.filter((chat) => chat.id !== id);
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id ?? null);
  };
  const handleLogout = async () => { try { await logout.mutateAsync(); } finally { navigate('/login', { replace: true }); } };

  const sidebar = <>
    <div className="flex items-center justify-between px-5 py-5">
      <a href="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white"><Sparkles size={19} /></span> Lumen</a>
      <button className="icon-button md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button>
    </div>
    <button onClick={startNew} className="new-chat mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium"><SquarePen size={17} /> New conversation <Plus className="ml-auto" size={16} /></button>
    <div className="px-5 pt-8 pb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">Recent</div>
    <div className="min-h-0 flex-1 overflow-y-auto px-3">
      {conversations.map((chat) => <div key={chat.id} className={`group flex items-center rounded-lg ${activeId === chat.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
        <button onClick={() => { setActiveId(chat.id); setError(''); setMobileOpen(false); }} className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left text-[13px] text-slate-600"><MessageSquare size={15} className="shrink-0 text-slate-400" /><span className="truncate">{chat.title}</span></button>
        <button onClick={() => removeChat(chat.id)} className="mr-2 rounded p-1 text-slate-400 opacity-0 hover:text-red-500 group-hover:opacity-100" aria-label="Delete conversation"><Trash2 size={14} /></button>
      </div>)}
      {!conversations.length && <p className="px-4 text-xs leading-5 text-slate-400">Your conversations will appear here.</p>}
    </div>
    <div className="border-t border-slate-200 p-3">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">{(user?.name || user?.email || 'U')[0].toUpperCase()}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-slate-700">{user?.name || 'Your account'}</div><div className="truncate text-xs text-slate-400">{user?.email}</div></div><button onClick={handleLogout} disabled={logout.isPending} className="rounded-lg px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100">Log out</button></div>
    </div>
  </>;

  return <div className="chat-shell flex h-screen overflow-hidden bg-white text-slate-900">
    <aside className="hidden w-[268px] shrink-0 flex-col border-r border-slate-200 bg-[#fafbfc] md:flex">{sidebar}</aside>
    {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-950/30 md:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-[290px] flex-col bg-[#fafbfc]" onClick={(event) => event.stopPropagation()}>{sidebar}</aside></div>}
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-7"><div className="flex items-center gap-3"><button className="icon-button md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20} /></button><div className="text-sm font-medium text-slate-700">AI Assistant</div><span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 sm:inline">Ready</span></div><div className="flex items-center gap-2 text-xs text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure conversation</div></header>
      <section className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className={`mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-8 ${messages.length ? 'pt-8' : 'justify-center py-10'}`}>
          {!messages.length ? <div className="mx-auto w-full max-w-2xl">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Sparkles size={23} /></div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.17em] text-violet-600">Your thinking partner</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-[40px]">What can I help you with?</h1>
            <p className="mt-3 max-w-lg text-[15px] leading-7 text-slate-500">Ask a question, explore an idea, or get a hand with the work in front of you.</p>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="suggestion-card rounded-xl p-4 text-left text-sm leading-5 text-slate-600">{suggestion}<span className="mt-5 block text-violet-600"><Send size={15} /></span></button>)}</div>
          </div> : <div className="space-y-7 pb-8">{messages.map((message, index) => <article key={`${activeId}-${index}`} className="flex gap-3.5">
            <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${message.role === 'assistant' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>{message.role === 'assistant' ? <Bot size={17} /> : <UserRound size={16} />}</div>
            <div className="min-w-0 flex-1 pt-1"><div className="mb-1.5 text-xs font-semibold text-slate-500">{message.role === 'assistant' ? 'Lumen' : 'You'}</div><div className="whitespace-pre-wrap text-[14px] leading-7 text-slate-700">{message.content || (busy && index === messages.length - 1 ? <span className="typing-dots"><i /><i /><i /></span> : '')}</div></div>
          </article>)}<div ref={endRef} /></div>}
        </div>
        <div className="sticky bottom-0 w-full bg-gradient-to-t from-white via-white to-white/0 px-4 pt-5 pb-5 sm:px-8"><div className="mx-auto max-w-3xl">
          {error && <div role="alert" className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="composer flex items-end gap-3 rounded-2xl p-3 pl-4"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Message Lumen…" rows={1} className="max-h-40 min-h-10 flex-1 resize-y bg-transparent py-2 text-sm leading-6 outline-none placeholder:text-slate-400" aria-label="Message" /><button type="submit" disabled={!input.trim() || busy} className="send-button grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={17} /></button></form>
          <p className="mt-2 text-center text-[10px] text-slate-400">AI can make mistakes. Review important information.</p>
        </div></div>
      </section>
    </main>
  </div>;
}
