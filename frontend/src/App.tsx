import { useState, useEffect } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { Sidebar } from './components/dashboard/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatScreen } from './components/chat/ChatScreen';
import { KbdOverlay } from './components/KbdOverlay';
import { Toast } from './components/Primitives';
import { SAMPLE_DOCS, RECENT_QUERIES } from './data/sample';
import type { Doc } from './data/sample';

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

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [route, setRoute] = useState<Route>({ name: 'login' });
  const [docs, setDocs] = useState<Doc[]>(SAMPLE_DOCS);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showKbd, setShowKbd] = useState(false);
  const [sidebarOn, setSidebarOn] = useState(true);
  const [answerStyle] = useState<'bubbles' | 'document'>('bubbles');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === '/') { e.preventDefault(); setShowKbd(s => !s); }
      if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); setSidebarOn(s => !s); }
      if (meta && e.key.toLowerCase() === 'u' && route.name !== 'login' && route.name !== 'register') {
        e.preventDefault();
        setToast({ message: 'Document ingested', kind: 'success' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route.name]);

  const handlePin = (id: string) => {
    setDocs(d => d.map(x => x.id === id ? { ...x, pinned: !x.pinned } : x));
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
          recents={RECENT_QUERIES}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNav={(n) => {
            if (n === 'dashboard') setRoute({ name: 'dashboard' });
            else if (n === 'chat-all') setRoute({ name: 'chat-all' });
          }}
          onPickDoc={(id) => setRoute({ name: 'chat-doc', docId: id })}
        />
      )}

      {route.name === 'login' && (
        <LoginScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogin={() => setRoute({ name: 'dashboard' })}
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
          onUpload={() => setToast({ message: 'Document ingested', kind: 'success' })}
          onShowKbd={() => setShowKbd(true)}
          onNav={(n) => n === 'chat-all' && setRoute({ name: 'chat-all' })}
        />
      )}
      {(route.name === 'chat-all' || route.name === 'chat-doc') && (
        <ChatScreen
          docs={docs}
          sidebarOn={sidebarOn}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOn(s => !s)}
          currentDocId={route.name === 'chat-doc' ? route.docId : null}
          onSwitchDoc={(id) => setRoute(id ? { name: 'chat-doc', docId: id } : { name: 'chat-all' })}
          onBack={() => setRoute({ name: 'dashboard' })}
          answerStyle={answerStyle}
          onShowKbd={() => setShowKbd(true)}
        />
      )}

      <KbdOverlay open={showKbd} onClose={() => setShowKbd(false)}/>
      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)}/>}
    </div>
  );
}
