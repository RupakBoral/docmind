import React, { useState, useRef } from 'react';
import type { Doc } from '../../types';
import { DocThumb, Btn } from '../Primitives';
import { ISearch, IUpload, IKbd, ISun, IMoon, IMessage, IPin, IPinFilled, IDots } from '../Icons';

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 1) return 'Today';
  if (diff < 2) return 'Yesterday';
  if (diff < 7) return `${Math.floor(diff)} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const iconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10, border: 0, background: 'transparent',
  color: 'var(--ink-3)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function SectionHeader({ label, icon, style }: { label: string; icon?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, ...style }}>
      {icon}
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  );
}

function DocCard({ doc, onClick, onPin }: { doc: Doc; onClick: () => void; onPin: (id: string) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12,
        padding: 12, borderRadius: 18,
        background: hover ? 'var(--bg-softer)' : 'transparent',
        transition: 'background 0.15s, transform 0.15s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative' }}>
        <DocThumb doc={doc} w={208} h={264} />
        <button onClick={(e) => { e.stopPropagation(); onPin(doc.id); }} style={{
          position: 'absolute', top: 10, left: 10,
          width: 30, height: 30, borderRadius: '50%', border: 0,
          background: doc.pinned ? 'var(--accent)' : 'rgba(0,0,0,0.12)',
          color: doc.pinned ? 'var(--ink)' : 'var(--ink-3)',
          opacity: doc.pinned || hover ? 1 : 0,
          transition: 'opacity 0.15s', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(40,28,12,0.12)',
        }}>
          {doc.pinned ? <IPinFilled size={13} /> : <IPin size={13} />}
        </button>
      </div>
      <div style={{ padding: '0 4px' }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: 'var(--ink)',
          letterSpacing: '-0.005em', overflow: 'hidden',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          lineHeight: 1.3,
        }}>{doc.title}</div>
        <div style={{
          fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4,
          fontFamily: '"JetBrains Mono", monospace',
          display: 'flex', gap: 10,
        }}>
          <span>{formatDate(doc.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function DropZone({ onDrop, uploading }: { onDrop: (file: File) => void; uploading: boolean }) {
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openPicker = () => { if (!uploading) fileRef.current?.click(); };

  return (
    <div
      onClick={openPicker}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false);
        if (!uploading && e.dataTransfer.files?.length) onDrop(e.dataTransfer.files[0]);
      }}
      style={{
        border: `1.5px dashed ${over ? 'var(--sage)' : 'var(--line-3)'}`,
        background: over ? 'var(--sage-bg)' : 'var(--bg-softer)',
        borderRadius: 18, padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 0.15s',
        cursor: uploading ? 'default' : 'pointer',
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.length) { onDrop(e.target.files[0]); e.target.value = ''; }
        }}
      />
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: over ? 'var(--sage)' : 'var(--bg-hover)',
        color: over ? 'var(--bg)' : 'var(--ink-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {uploading ? <IDots size={18} /> : <IUpload size={18} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
          {uploading ? 'Ingesting your PDF…' : over ? 'Drop it here' : 'Drop a PDF, or click to choose'}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 2 }}>
          {uploading ? 'Chunking, embedding, indexing.' : 'Up to 50 MB. We chunk and embed it for semantic search.'}
        </div>
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <Btn size="sm" variant="secondary" onClick={openPicker} disabled={uploading}>
          Choose file
        </Btn>
      </span>
    </div>
  );
}

interface DashboardProps {
  docs: Doc[];
  onPickDoc: (id: string) => void;
  onPin: (id: string) => void;
  onUpload: (file: File) => Promise<void>;
  onShowKbd: () => void;
  sidebarOn: boolean;
  onToggleSidebar: () => void;
  onNav: (name: string) => void;
  theme: string;
  onToggleTheme: () => void;
}

export function Dashboard({ docs, onPickDoc, onPin, onUpload, onShowKbd, sidebarOn, onToggleSidebar, onNav, theme, onToggleTheme }: DashboardProps) {
  const [uploading, setUploading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const headerFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (uploading) return;
    setUploading(true);
    setErrMsg('');
    try {
      await onUpload(file);
    } catch (err: any) {
      setErrMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const pinned = docs.filter(d => d.pinned);
  const others = docs.filter(d => !d.pinned);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{
        height: 60, padding: '0 28px', display: 'flex', alignItems: 'center',
        gap: 16, borderBottom: '1px solid var(--line)', background: 'var(--bg)',
      }}>
        {!sidebarOn && (
          <button onClick={onToggleSidebar} style={iconBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <div style={{
          flex: 1, maxWidth: 380, height: 36, borderRadius: 10,
          background: 'var(--bg-softer)', display: 'flex', alignItems: 'center',
          gap: 8, padding: '0 12px', color: 'var(--ink-4)',
        }}>
          <ISearch size={14} />
          <span style={{ fontSize: 13, flex: 1 }}>Search documents…</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--ink-4)' }}>⌘K</span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onShowKbd} style={iconBtn} title="Keyboard shortcuts"><IKbd size={16} /></button>
        <button onClick={onToggleTheme} style={iconBtn} title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          {theme === 'dark' ? <ISun size={16} /> : <IMoon size={16} />}
        </button>
        <input
          ref={headerFileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files?.length) { handleUpload(e.target.files[0]); e.target.value = ''; } }}
        />
        <Btn size="sm" variant="primary" icon={<IUpload size={14} />} onClick={() => headerFileRef.current?.click()} disabled={uploading}>
          Upload PDF
        </Btn>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '32px 36px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 44, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.05 }}>
                Your library
              </div>
            </div>
            <Btn variant="soft" icon={<IMessage size={14} />} onClick={() => onNav('chat-all')} size="sm">
              Chat across all docs
            </Btn>
          </div>

          {errMsg && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'color-mix(in oklch, var(--danger) 10%, var(--bg))', color: 'var(--danger)', fontSize: 13 }}>
              {errMsg}
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <DropZone onDrop={handleUpload} uploading={uploading} />
          </div>

          {pinned.length > 0 && (
            <>
              <SectionHeader label="Pinned" icon={<IPinFilled size={12} stroke="var(--accent)" />} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 8 }}>
                {pinned.map(d => <DocCard key={d.id} doc={d} onClick={() => onPickDoc(d.id)} onPin={onPin} />)}
              </div>
            </>
          )}

          {others.length > 0 && (
            <>
              <SectionHeader label="All documents" style={{ marginTop: pinned.length ? 36 : 0 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(208px, 1fr))', gap: 8 }}>
                {others.map(d => <DocCard key={d.id} doc={d} onClick={() => onPickDoc(d.id)} onPin={onPin} />)}
              </div>
            </>
          )}

          {docs.length === 0 && !uploading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-4)' }}>
              <div style={{ fontSize: 15 }}>No documents yet. Upload a PDF to get started.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
