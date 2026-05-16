import React from 'react';
import { ILogo, ICheck, ISun, IMoon } from '../Icons';

interface AuthLayoutProps {
  children: React.ReactNode;
  theme: string;
  onToggleTheme: () => void;
}

export function AuthLayout({ children, theme, onToggleTheme }: AuthLayoutProps) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: 'var(--bg)', position: 'relative',
    }}>
      <button onClick={onToggleTheme} title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'} style={{
        position: 'absolute', top: 20, right: 20, width: 36, height: 36,
        borderRadius: 10, border: 0, background: 'var(--bg-soft)',
        color: 'var(--ink-3)', cursor: 'pointer', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {theme === 'dark' ? <ISun size={16}/> : <IMoon size={16}/>}
      </button>

      {/* Left: branding */}
      <div style={{
        flex: '1 1 44%', padding: '64px 56px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'var(--bg-soft)',
        borderRight: '1px solid var(--line)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)',
          right: -180, top: -160, opacity: 0.6, filter: 'blur(20px)',
        }}/>
        <div aria-hidden style={{
          position: 'absolute', width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--sage) 0%, transparent 65%)',
          left: -120, bottom: -100, opacity: 0.5, filter: 'blur(20px)',
        }}/>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ILogo size={36}/>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 28, letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}>Docmind</div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.05,
            letterSpacing: '-0.025em', color: 'var(--ink)',
            textWrap: 'balance' as const, maxWidth: 480,
          }}>
            Conversations with the documents you already trust.
          </div>
          <div style={{ marginTop: 22, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-3)', maxWidth: 420 }}>
            Drop a PDF in. Ask anything. Every answer cites the page it came from — never an opinion the document didn't actually have.
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', gap: 28, fontSize: 12.5, color: 'var(--ink-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ICheck size={13} stroke="var(--sage)"/> Page-level citations</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ICheck size={13} stroke="var(--sage)"/> Your data stays yours</div>
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        flex: '1 1 56%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 48,
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
