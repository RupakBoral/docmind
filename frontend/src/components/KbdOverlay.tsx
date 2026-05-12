import { useEffect } from 'react';
import { KBD_SHORTCUTS } from '../types/index';
import { IX } from './Icons';

interface KbdOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function KbdOverlay({ open, onClose }: KbdOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 90, padding: 24, animation: 'fadeIn 0.15s',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, background: 'var(--bg)',
        borderRadius: 22, padding: 28, boxShadow: '0 24px 80px rgba(40,28,12,0.25)',
        animation: 'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, letterSpacing: '-0.015em', color: 'var(--ink)' }}>
            Keyboard shortcuts
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 10, border: 0,
            background: 'var(--bg-hover)', color: 'var(--ink-3)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IX size={14} /></button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-4)', marginBottom: 22 }}>
          Move faster. These work everywhere in Docmind.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {KBD_SHORTCUTS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 4px', borderBottom: i < KBD_SHORTCUTS.length - 1 ? '1px solid var(--line)' : 'none',
            }}>
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.keys.map((k, j) => (
                  <kbd key={j} style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                    padding: '3px 8px', borderRadius: 6, minWidth: 22, textAlign: 'center',
                    background: 'var(--bg-softer)', color: 'var(--ink-2)',
                    border: '1px solid var(--line-2)',
                    boxShadow: '0 1px 0 var(--line-2)',
                  }}>{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
