import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Btn } from '../Primitives';
import { IDots } from '../Icons';

interface LoginScreenProps {
  theme: string;
  onToggleTheme: () => void;
  onLogin: () => void;
  onSwitch: () => void;
}

function Field({ label, type = 'text', value, onChange, error, autoFocus, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string;
  autoFocus?: boolean; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink-3)', marginBottom: 6, letterSpacing: '0.005em' }}>
        {label}
      </div>
      <input
        type={type} value={value} placeholder={placeholder} autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 44, padding: '0 14px', borderRadius: 12,
          border: error ? '1.5px solid var(--danger)' : focused ? '1.5px solid var(--ink-3)' : '1px solid var(--line-2)',
          background: 'var(--bg-input)', fontSize: 14, color: 'var(--ink)',
          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          transition: 'border 0.15s',
        }}
      />
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{error}</div>}
    </label>
  );
}

export function LoginScreen({ theme, onToggleTheme, onLogin, onSwitch }: LoginScreenProps) {
  const [email, setEmail] = useState('alex@docmind.app');
  const [pw, setPw] = useState('••••••••');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors: Record<string, string> = {};
    if (!email.includes('@')) errors.email = 'Enter a valid email';
    if (pw.length < 4) errors.pw = 'Password must be at least 8 characters';
    setErrs(errors);
    if (Object.keys(errors).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 700);
  };

  return (
    <AuthLayout theme={theme} onToggleTheme={onToggleTheme}>
      <form onSubmit={submit}>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 38, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
          Welcome back.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 8, marginBottom: 32 }}>
          Sign in to keep the conversation going.
        </div>

        <Field label="Email" type="email" value={email} onChange={setEmail} error={errs.email} autoFocus placeholder="you@company.com"/>
        <Field label="Password" type="password" value={pw} onChange={setPw} error={errs.pw} placeholder="••••••••"/>

        <div style={{ marginTop: 8, marginBottom: 24, textAlign: 'right' }}>
          <a style={{ fontSize: 12.5, color: 'var(--ink-3)', textDecoration: 'none' }} href="#">
            Forgot password?
          </a>
        </div>

        <Btn type="submit" size="lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? <><IDots size={16}/> Signing in…</> : 'Sign in'}
        </Btn>

        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
          New here?{' '}
          <a onClick={(e) => { e.preventDefault(); onSwitch(); }} href="#"
            style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}>
            Create an account
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
