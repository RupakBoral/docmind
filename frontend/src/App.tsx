import { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { Sidebar } from './components/dashboard/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatScreen } from './components/chat/ChatScreen';
import { KbdOverlay } from './components/KbdOverlay';
import { Toast } from './components/Primitives';
import { useAuth } from './context/auth';
import * as api from './api';
import type { ApiDoc } from './api';
import type { Doc } from './types';

type Route =
  | { name: 'login' }
  | { name: 'register' }
  | { name: 'dashboard' }
  | { name: 'chat-all' }
  | { name: 'chat-doc'; docId: string };

interface ToastState {
  message: string;
  kind: 'info' | 'success' | 'error';
}

const COLOR_PALETTE = [
  { color: 'oklch(0.92 0.04 25)', accent: 'oklch(0.55 0.13 25)' },
  { color: 'oklch(0.93 0.035 155)', accent: 'oklch(0.5 0.1 155)' },
  { color: 'oklch(0.92 0.04 240)', accent: 'oklch(0.5 0.13 240)' },
  { color: 'oklch(0.93 0.035 55)', accent: 'oklch(0.55 0.12 55)' },
  { color: 'oklch(0.93 0.038 295)', accent: 'oklch(0.5 0.12 295)' },
  { color: 'oklch(0.92 0.04 100)', accent: 'oklch(0.5 0.12 100)' },
];

function getPinnedIds(accountId: string): Set<string> {
  try {
    const s = localStorage.getItem(`docmind_pinned_${accountId}`);
    return s ? new Set(JSON.parse(s)) : new Set();
  } catch { return new Set(); }
}

function savePinnedIds(accountId: string, ids: Set<string>) {
  localStorage.setItem(`docmind_pinned_${accountId}`, JSON.stringify([...ids]));
}

function apiDocToDoc(d: ApiDoc, pinnedIds: Set<string>): Doc {
  const idx = d.id.charCodeAt(0) % COLOR_PALETTE.length;
  const { color, accent } = COLOR_PALETTE[idx];
  return {
    id: d.id,
    name: d.name,
    title: d.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
    pages: d.pages ?? 0,
    size: d.size ?? 0,
    createdAt: d.createdAt,
    color,
    accent,
    pinned: pinnedIds.has(d.id),
    excerpt: '',
  };
}

export default function App() {
  const { user, setUser } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [route, setRoute] = useState<Route>(() => user ? { name: 'dashboard' } : { name: 'login' });
  const [docs, setDocs] = useState<Doc[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showKbd, setShowKbd] = useState(false);
  const [sidebarOn, setSidebarOn] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const loadDocs = useCallback(async () => {
    if (!user) return;
    try {
      const apiDocs = await api.listDocuments(user.account_id);
      const pinnedIds = getPinnedIds(user.account_id);
      setDocs(apiDocs.map(d => apiDocToDoc(d, pinnedIds)));
    } catch {
      setToast({ message: 'Failed to load documents', kind: 'error' });
    }
  }, [user]);

  useEffect(() => {
    if (user) loadDocs();
  }, [user, loadDocs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === '/') { e.preventDefault(); setShowKbd(s => !s); }
      if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); setSidebarOn(s => !s); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handlePin = (id: string) => {
    if (!user) return;
    setDocs(d => {
      const updated = d.map(x => x.id === id ? { ...x, pinned: !x.pinned } : x);
      savePinnedIds(user.account_id, new Set(updated.filter(x => x.pinned).map(x => x.id)));
      return updated;
    });
  };

  const handleUpload = async (file: File): Promise<void> => {
    if (!user) return;
    await api.ingestDocument(user.account_id, file);
    await loadDocs();
    setToast({ message: 'Document ingested', kind: 'success' });
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch { }
    setUser(null);
    setDocs([]);
    setRoute({ name: 'login' });
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const isAuth = route.name === 'login' || route.name === 'register';
  const showSidebar = !isAuth && sidebarOn;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden', background: 'var(--bg)' }}>
      {showSidebar && (
        <Sidebar
          active={route.name === 'dashboard' ? 'dashboard' : route.name.startsWith('chat') ? 'chat' : ''}
          sidebarOn={sidebarOn}
          onToggle={() => setSidebarOn(s => !s)}
          docs={docs}
          recents={[]}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNav={(n) => {
            if (n === 'dashboard') setRoute({ name: 'dashboard' });
            else if (n === 'chat-all') setRoute({ name: 'chat-all' });
          }}
          onPickDoc={(id) => setRoute({ name: 'chat-doc', docId: id })}
          userName={user ? `${user.first_name} ${user.last_name}` : undefined}
          userEmail={user?.email}
          onLogout={handleLogout}
        />
      )}

      {route.name === 'login' && (
        <LoginScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogin={(u) => { setUser(u); setRoute({ name: 'dashboard' }); }}
          onSwitch={() => setRoute({ name: 'register' })}
        />
      )}
      {route.name === 'register' && (
        <RegisterScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onRegister={() => {
            setToast({ message: 'Account created — please sign in', kind: 'success' });
            setRoute({ name: 'login' });
          }}
          onSwitch={() => setRoute({ name: 'login' })}
        />
      )}
      {route.name === 'dashboard' && (
        <Dashboard
          docs={docs}
          sidebarOn={sidebarOn}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOn(s => !s)}
          onPickDoc={(id) => setRoute({ name: 'chat-doc', docId: id })}
          onPin={handlePin}
          onUpload={handleUpload}
          onShowKbd={() => setShowKbd(true)}
          onNav={(n) => n === 'chat-all' && setRoute({ name: 'chat-all' })}
        />
      )}
      {(route.name === 'chat-all' || route.name === 'chat-doc') && (
        <ChatScreen
          docs={docs}
          accountId={user?.account_id || ''}
          sidebarOn={sidebarOn}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOn(s => !s)}
          currentDocId={route.name === 'chat-doc' ? route.docId : null}
          onSwitchDoc={(id) => setRoute(id ? { name: 'chat-doc', docId: id } : { name: 'chat-all' })}
          onBack={() => setRoute({ name: 'dashboard' })}
          answerStyle="bubbles"
          onShowKbd={() => setShowKbd(true)}
        />
      )}

      <KbdOverlay open={showKbd} onClose={() => setShowKbd(false)} />
      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </div>
  );
}
