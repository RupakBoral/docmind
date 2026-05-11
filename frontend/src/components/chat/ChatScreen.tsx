import React, { useState, useRef, useEffect } from 'react';
import type { Doc, Message, Citation } from '../../data/sample';
import { SAMPLE_THREADS } from '../../data/sample';
import { TypingDots } from '../Primitives';
import { IArrowL, IChevDown, IKbd, ISun, IMoon, ISparkle, ISend } from '../Icons';

const kbdInline: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
  padding: '1px 5px', borderRadius: 4, background: 'var(--bg-hover)',
  color: 'var(--ink-3)', border: '1px solid var(--line-2)',
};

const iconBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10, border: 0, background: 'transparent',
  color: 'var(--ink-3)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function CiteChip({ citation, docs, num, onClick }: { citation: Citation; docs: Doc[]; num: number; onClick?: () => void }) {
  const doc = docs.find(d => d.id === citation.docId);
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 7px', borderRadius: 6, border: 0,
      background: doc ? doc.color : 'var(--bg-hover)',
      color: doc ? doc.accent : 'var(--ink-3)',
      fontSize: 10.5, fontFamily: '"JetBrains Mono", monospace', fontWeight: 500,
      cursor: 'pointer', verticalAlign: 'baseline', marginLeft: 3,
    }} title={citation.snippet}>
      {num}
    </button>
  );
}

function CitationCard({ citation, docs, num }: { citation: Citation; docs: Doc[]; num: number }) {
  const doc = docs.find(d => d.id === citation.docId);
  return (
    <div style={{
      display: 'flex', gap: 12, padding: 12, borderRadius: 12,
      background: 'var(--bg-softer)', border: '1px solid var(--line)',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: doc ? doc.color : 'var(--bg-hover)',
        color: doc ? doc.accent : 'var(--ink-3)',
        fontSize: 11, fontFamily: '"JetBrains Mono", monospace', fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{num}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11.5, color: 'var(--ink-4)', marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          <span style={{ color: doc?.accent || 'inherit', fontWeight: 500 }}>{doc?.title || 'Document'}</span>
          <span>·</span><span>p. {citation.page}</span>
          <span>·</span><span>chunk {citation.chunk}</span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)', fontStyle: 'italic' }}>
          "{citation.snippet}"
        </div>
      </div>
    </div>
  );
}

function renderWithCites(text: string, citations: Citation[] | undefined, docs: Doc[]) {
  if (!citations || !citations.length) return <span>{text}</span>;
  const parts = text.split(/\n\n/);
  return parts.map((para, pi) => {
    const citesForPara = pi === parts.length - 1 ? citations : [];
    return (
      <p key={pi} style={{ margin: pi === 0 ? '0 0 14px' : '14px 0' }}>
        {para}
        {citesForPara.map((c, i) => (
          <CiteChip key={i} citation={c} docs={docs} num={i + 1}/>
        ))}
      </p>
    );
  });
}

function MessageBubble({ msg, docs }: { msg: Message; docs: Doc[] }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <div style={{
          maxWidth: '78%', padding: '12px 16px', borderRadius: '20px 20px 4px 20px',
          background: 'var(--ink)', color: 'var(--bg)',
          fontSize: 14, lineHeight: 1.5,
        }}>{msg.content}</div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'var(--accent)', color: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><ISparkle size={14}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          padding: '12px 18px', borderRadius: '4px 20px 20px 20px',
          background: 'var(--bg-softer)', color: 'var(--ink)',
          fontSize: 14, lineHeight: 1.6,
        }}>
          {renderWithCites(msg.content, msg.citations, docs)}
        </div>
        {msg.citations && msg.citations.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)', padding: '0 4px' }}>
              {msg.citations.length} sources
            </div>
            {msg.citations.map((c, i) => <CitationCard key={i} citation={c} docs={docs} num={i + 1}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageDoc({ msg, docs }: { msg: Message; docs: Doc[] }) {
  if (msg.role === 'user') {
    return (
      <div style={{ marginBottom: 24, paddingLeft: 18, borderLeft: '2.5px solid var(--accent)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 6 }}>
          You asked
        </div>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, letterSpacing: '-0.015em', color: 'var(--ink)', lineHeight: 1.25 }}>
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 10 }}>
        Answer
      </div>
      <div style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-2)' }}>
        {renderWithCites(msg.content, msg.citations, docs)}
      </div>
      {msg.citations && msg.citations.length > 0 && (
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: 12 }}>
            From your documents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msg.citations.map((c, i) => <CitationCard key={i} citation={c} docs={docs} num={i + 1}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function DocSelector({ docs, currentDocId, onChange }: { docs: Doc[]; currentDocId: string | null; onChange: (id: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const current = currentDocId ? docs.find(d => d.id === currentDocId) : null;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 8px 14px',
        height: 38, borderRadius: 999, border: '1px solid var(--line-2)',
        background: 'var(--bg)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
      }}>
        <span style={{ color: 'var(--ink-4)' }}>Searching:</span>
        {current ? (
          <>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: current.accent }}/>
            <span style={{ fontWeight: 500 }}>{current.title}</span>
          </>
        ) : <span style={{ fontWeight: 500 }}>All documents</span>}
        <IChevDown size={13} style={{ color: 'var(--ink-4)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: 320,
          background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--line-2)',
          boxShadow: '0 12px 40px rgba(40,28,12,0.12)', padding: 6, zIndex: 20, maxHeight: 360, overflow: 'auto',
        }}>
          <button onClick={() => { onChange(null); setOpen(false); }} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            width: '100%', border: 0, background: !currentDocId ? 'var(--bg-hover)' : 'transparent',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)', borderRadius: 9, textAlign: 'left',
          }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--bg-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ISparkle size={11} stroke="var(--ink-3)"/>
            </div>
            <span>All documents</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)', fontFamily: '"JetBrains Mono", monospace' }}>{docs.length}</span>
          </button>
          <div style={{ height: 1, background: 'var(--line)', margin: '4px 6px' }}/>
          {docs.map(d => (
            <button key={d.id} onClick={() => { onChange(d.id); setOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
              width: '100%', border: 0, background: currentDocId === d.id ? 'var(--bg-hover)' : 'transparent',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)', borderRadius: 9, textAlign: 'left',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: d.color, flexShrink: 0 }}/>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)', fontFamily: '"JetBrains Mono", monospace' }}>{d.chunks}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatEmpty({ doc, onPickPrompt }: { doc: Doc | null | undefined; onPickPrompt: (p: string) => void }) {
  const prompts = doc ? [
    `Summarize the main argument of ${doc.title.split(':')[0]} in three sentences`,
    `What are the most important diagrams in this document?`,
    `Quote the section that defines the core terminology`,
    `What does this document NOT cover that I should know?`,
  ] : [
    'Compare what each of my docs says about caching',
    'Find every mention of "consistency" across all documents',
    'Which document is most relevant to onboarding a new engineer?',
    'Summarize the last document I uploaded',
  ];
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
        background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ISparkle size={22} stroke="var(--ink-3)"/>
      </div>
      <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 32, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
        What would you like to know?
      </div>
      <div style={{ fontSize: 14, color: 'var(--ink-4)', marginTop: 8, marginBottom: 28 }}>
        {doc ? `Searching ${doc.title}` : 'Searching across all your documents'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 560, margin: '0 auto' }}>
        {prompts.map((p, i) => (
          <button key={i} onClick={() => onPickPrompt(p)} style={{
            padding: '14px 16px', borderRadius: 14, border: '1px solid var(--line)',
            background: 'var(--bg)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 13, lineHeight: 1.4,
            color: 'var(--ink-2)', textAlign: 'left', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line-3)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-softer)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ChatScreenProps {
  docs: Doc[];
  currentDocId: string | null;
  onSwitchDoc: (id: string | null) => void;
  onBack: () => void;
  answerStyle: 'bubbles' | 'document';
  onShowKbd: () => void;
  sidebarOn: boolean;
  onToggleSidebar: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export function ChatScreen({ docs, currentDocId, onSwitchDoc, onBack, answerStyle, onShowKbd, sidebarOn, onToggleSidebar, theme, onToggleTheme }: ChatScreenProps) {
  const getInitial = (docId: string | null) => {
    if (docId && SAMPLE_THREADS[docId]) return SAMPLE_THREADS[docId];
    if (!docId && SAMPLE_THREADS.all) return SAMPLE_THREADS.all;
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(() => getInitial(currentDocId));
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getInitial(currentDocId));
  }, [currentDocId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

  const send = () => {
    const text = input.trim();
    if (!text || pending) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setPending(true);
    setTimeout(() => {
      const doc = currentDocId ? docs.find(d => d.id === currentDocId) : null;
      const reply: Message = {
        role: 'assistant',
        content: doc
          ? `Based on ${doc.title}, ${text.toLowerCase().startsWith('how') ? 'the document explains it as a multi-stage process' : 'this is addressed in the relevant section'}. The handling combines both deterministic and probabilistic strategies, balancing correctness with throughput.`
          : `Across your library, this comes up in three places. The treatment is consistent: bounded-memory primitives that trade exactness for predictable resource use.`,
        citations: [
          { docId: doc?.id || 'doc_redis', page: 73, chunk: 142, snippet: 'The mechanism described here trades exactness for bounded latency, with worst-case behavior dominated by sample size rather than dataset size.' },
          { docId: doc?.id || 'doc_system', page: 156, chunk: 298, snippet: 'For workloads where stale reads are tolerable, the eventually-consistent path simplifies coordination and reduces tail latency.' },
        ],
      };
      setMessages(m => [...m, reply]);
      setPending(false);
    }, 1400);
  };

  const currentDoc = currentDocId ? docs.find(d => d.id === currentDocId) : null;
  const isDoc = answerStyle === 'document';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{
        height: 60, padding: '0 24px', display: 'flex', alignItems: 'center',
        gap: 14, borderBottom: '1px solid var(--line)', background: 'var(--bg)',
      }}>
        {!sidebarOn && (
          <button onClick={onToggleSidebar} style={iconBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
        )}
        <button onClick={onBack} style={{ ...iconBtn, width: 32, height: 32 }} title="Back to library">
          <IArrowL size={15}/>
        </button>
        <DocSelector docs={docs} currentDocId={currentDocId} onChange={onSwitchDoc}/>
        <div style={{ flex: 1 }}/>
        {currentDoc && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-4)', fontFamily: '"JetBrains Mono", monospace' }}>
            <span>{currentDoc.pages} pp</span><span>·</span><span>{currentDoc.chunks} chunks</span>
          </div>
        )}
        <button onClick={onShowKbd} style={iconBtn} title="Keyboard shortcuts"><IKbd size={16}/></button>
        <button onClick={onToggleTheme} style={iconBtn}>
          {theme === 'dark' ? <ISun size={16}/> : <IMoon size={16}/>}
        </button>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        <div style={{ maxWidth: isDoc ? 720 : 760, margin: '0 auto', padding: isDoc ? '40px 28px 120px' : '32px 28px 120px' }}>
          {messages.length === 0 && <ChatEmpty doc={currentDoc} onPickPrompt={(p) => setInput(p)}/>}
          {messages.map((m, i) => (
            isDoc
              ? <MessageDoc key={i} msg={m} docs={docs}/>
              : <MessageBubble key={i} msg={m} docs={docs}/>
          ))}
          {pending && <TypingDots/>}
        </div>
      </div>

      <div style={{ padding: '16px 24px 22px', borderTop: '1px solid var(--line)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            background: 'var(--bg-softer)', borderRadius: 22, padding: '8px 8px 8px 18px',
            border: '1px solid var(--line)',
          }}>
            <textarea
              value={input} rows={1}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={currentDoc ? `Ask anything about ${currentDoc.title.split(':')[0]}…` : 'Ask across all your documents…'}
              style={{
                flex: 1, minHeight: 28, maxHeight: 140, resize: 'none',
                border: 0, background: 'transparent', outline: 'none',
                fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5,
                color: 'var(--ink)', padding: '8px 0',
              }}
            />
            <button onClick={send} disabled={!input.trim() || pending} style={{
              width: 36, height: 36, borderRadius: '50%', border: 0,
              background: input.trim() && !pending ? 'var(--ink)' : 'var(--line-2)',
              color: input.trim() && !pending ? 'var(--bg)' : 'var(--ink-4)',
              cursor: input.trim() && !pending ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}>
              <ISend size={14}/>
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between', padding: '0 6px' }}>
            <span>Press <kbd style={kbdInline}>Enter</kbd> to send · <kbd style={kbdInline}>⇧↵</kbd> for newline</span>
            <span>Answers cite the page they came from.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
