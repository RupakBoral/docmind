import React from 'react';
import type { Doc, RecentQuery } from '../../data/sample';
import { ILogo, IFile, IMessage, ISettings } from '../Icons';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
      border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5,
      borderRadius: 8, textAlign: 'left', width: '100%',
      background: active ? 'var(--bg-active)' : 'transparent',
      color: active ? 'var(--ink)' : 'var(--ink-2)',
      fontWeight: active ? 500 : 400,
    }}
    onMouseEnter={(e) => !active && ((e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)')}
    onMouseLeave={(e) => !active && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
    >
      {icon}<span>{label}</span>
    </button>
  );
}

interface SidebarProps {
  active: string;
  onNav: (name: string) => void;
  sidebarOn: boolean;
  onToggle: () => void;
  recents: RecentQuery[];
  docs: Doc[];
  theme?: string;
  onToggleTheme?: () => void;
  onPickDoc: (id: string) => void;
}

export function Sidebar({ active, onNav, sidebarOn, recents, docs, onPickDoc }: SidebarProps) {
  if (!sidebarOn) return null;
  return (
    <aside style={{
      width: 260, flexShrink: 0, height: '100%',
      background: 'var(--bg-soft)',
      borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <ILogo size={28}/>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)' }}>Docmind</div>
      </div>

      <nav style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavItem icon={<IFile size={16}/>} label="Documents" active={active === 'dashboard'} onClick={() => onNav('dashboard')}/>
        <NavItem icon={<IMessage size={16}/>} label="Chat" active={active === 'chat'} onClick={() => onNav('chat-all')}/>
      </nav>

      <div style={{ padding: '20px 20px 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
        Pinned
      </div>
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {docs.filter(d => d.pinned).map(d => (
          <button key={d.id} onClick={() => onPickDoc(d.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px',
            border: 0, background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-2)',
            borderRadius: 8, textAlign: 'left', width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div style={{ width: 6, height: 6, borderRadius: 2, background: d.accent, flexShrink: 0 }}/>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
        Recent
      </div>
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 1, flex: 1, overflow: 'auto' }}>
        {recents.map((r, i) => (
          <button key={i} onClick={() => onPickDoc(r.doc)} style={{
            display: 'block', textAlign: 'left', padding: '8px 8px',
            border: 0, background: 'transparent', cursor: 'pointer',
            fontFamily: 'inherit', borderRadius: 8, width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div style={{
              fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.35,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>{r.q}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-5)', marginTop: 2 }}>{r.when}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent)', color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 600, fontSize: 12,
        }}>AP</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Alex Park</div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            alex@docmind.app
          </div>
        </div>
        <button onClick={() => onNav('settings')} style={{
          width: 30, height: 30, border: 0, background: 'transparent',
          color: 'var(--ink-4)', cursor: 'pointer', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <ISettings size={15}/>
        </button>
      </div>
    </aside>
  );
}
