import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Btn } from '../Primitives';
import { IDots } from '../Icons';
import { login } from '../../api';
import type { User } from '../../api';

interface LoginScreenProps {
  theme: string;
  onToggleTheme: () => void;
  onLogin: (user: User) => void;
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
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors: Record<string, string> = {};
    if (!email.includes('@')) errors.email = 'Enter a valid email';
    if (pw.length < 4) errors.pw = 'Password required';
    setErrs(errors);
    if (Object.keys(errors).length) return;
    setLoading(true);
    try {
      const { user } = await login(email, pw);
      onLogin(user);
    } catch (err: any) {
      setErrs({ form: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
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

        {errs.form && (
          <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12, padding: '8px 12px', background: 'color-mix(in oklch, var(--danger) 10%, var(--bg))', borderRadius: 8 }}>
            {errs.form}
          </div>
        )}

        <Btn type="submit" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
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
