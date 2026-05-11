import React, { useMemo } from 'react';
import type { Doc } from '../data/sample';
import { ICheck, IX, ISparkle } from './Icons';

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', icon, style, type = 'button', disabled }: BtnProps) {
  const sz = size === 'sm' ? { h: 32, px: 12, fs: 13 } : size === 'lg' ? { h: 48, px: 22, fs: 15 } : { h: 38, px: 16, fs: 14 };
  const bg = variant === 'primary' ? 'var(--ink)' :
             variant === 'ghost'   ? 'transparent' :
             variant === 'soft'    ? 'var(--bg-hover)' : 'var(--bg)';
  const fg = variant === 'primary' ? 'var(--bg)' : 'var(--ink)';
  const border = variant === 'secondary' ? '1px solid var(--line-2)' :
                 variant === 'ghost' ? '1px solid transparent' : 'none';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={(e) => !disabled && ((e.currentTarget as HTMLElement).style.transform = 'scale(0.98)')}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
      style={{
        height: sz.h, padding: `0 ${sz.px}px`, borderRadius: 999, border,
        background: bg, color: fg, fontSize: sz.fs, fontWeight: 500,
        fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, transform 0.05s', whiteSpace: 'nowrap',
        letterSpacing: '-0.005em', ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

interface ToastProps {
  message: string;
  kind?: 'info' | 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, kind = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: 'var(--bg)',
      padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 10, zIndex: 100,
      boxShadow: '0 12px 32px rgba(40,28,12,0.25)',
      animation: 'toastIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {kind === 'success' && <ICheck size={14} stroke="var(--sage)"/>}
      {kind === 'error' && <IX size={14} stroke="var(--danger)"/>}
      {message}
    </div>
  );
}

export function DocThumb({ doc, w = 200, h = 248 }: { doc: Doc; w?: number; h?: number }) {
  const lines = useMemo(() => {
    const out: number[] = [];
    let s = doc.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let i = 0; i < 9; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(40 + (s % 50));
    }
    return out;
  }, [doc.id]);

  return (
    <div style={{
      width: w, height: h, borderRadius: 14, position: 'relative',
      background: doc.color, overflow: 'hidden', flexShrink: 0,
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 22, height: 22,
        background: 'linear-gradient(225deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.18) 50%, transparent 50%)',
      }}/>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 22, height: 22,
        background: 'linear-gradient(225deg, var(--doc-fold-page) 0%, var(--doc-fold-page) 50%, transparent 50%)',
        clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
      }}/>
      <div style={{
        position: 'absolute', top: 18, left: 16, right: 16,
        fontFamily: '"Instrument Serif", serif', fontSize: w > 180 ? 22 : 16,
        lineHeight: 1.05, color: doc.accent, letterSpacing: '-0.01em',
      }}>
        {doc.title}
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 38, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map((wd, i) => (
          <div key={i} style={{
            height: 4, width: `${wd}%`, borderRadius: 2,
            background: doc.accent, opacity: 0.16,
          }}/>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 12, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 9.5,
        letterSpacing: '0.04em', color: doc.accent, opacity: 0.65,
        textTransform: 'uppercase',
      }}>
        <span>PDF</span>
        <span>{doc.pages} pp</span>
      </div>
    </div>
  );
}

export function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'var(--accent)', color: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><ISparkle size={14}/></div>
      <div style={{
        padding: '14px 18px', borderRadius: '4px 20px 20px 20px',
        background: 'var(--bg-softer)',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <span className="dm-dot" style={{ animationDelay: '0s' }}/>
        <span className="dm-dot" style={{ animationDelay: '0.15s' }}/>
        <span className="dm-dot" style={{ animationDelay: '0.3s' }}/>
      </div>
    </div>
  );
}
