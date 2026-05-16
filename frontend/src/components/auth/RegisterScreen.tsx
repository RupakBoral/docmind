import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Btn } from '../Primitives';
import { IDots } from '../Icons';
import { register } from '../../api';

interface RegisterScreenProps {
  theme: string;
  onToggleTheme: () => void;
  onRegister: () => void;
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

export function RegisterScreen({ theme, onToggleTheme, onRegister, onSwitch }: RegisterScreenProps) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors: Record<string, string> = {};
    if (!first.trim()) errors.first = 'Required';
    if (!last.trim()) errors.last = 'Required';
    if (!email.includes('@')) errors.email = 'Enter a valid email';
    if (pw.length < 8) errors.pw = 'At least 8 characters';
    setErrs(errors);
    if (Object.keys(errors).length) return;
    setLoading(true);
    try {
      await register({ first_name: first.trim(), last_name: last.trim(), email, password: pw });
      onRegister();
    } catch (err: any) {
      setErrs({ form: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout theme={theme} onToggleTheme={onToggleTheme}>
      <form onSubmit={submit}>
        <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 38, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
          Make a Docmind account.
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 8, marginBottom: 32 }}>
          Free while we're in beta. No card required.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="First name" value={first} onChange={setFirst} error={errs.first} autoFocus placeholder="Alex"/>
          <Field label="Last name" value={last} onChange={setLast} error={errs.last} placeholder="Park"/>
        </div>
        <Field label="Email" type="email" value={email} onChange={setEmail} error={errs.email} placeholder="you@company.com"/>
        <Field label="Password" type="password" value={pw} onChange={setPw} error={errs.pw} placeholder="At least 8 characters"/>

        {errs.form && (
          <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12, padding: '8px 12px', background: 'color-mix(in oklch, var(--danger) 10%, var(--bg))', borderRadius: 8 }}>
            {errs.form}
          </div>
        )}

        <Btn type="submit" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
          {loading ? <><IDots size={16}/> Creating…</> : 'Create account'}
        </Btn>

        <div style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
          Already have an account?{' '}
          <a onClick={(e) => { e.preventDefault(); onSwitch(); }} href="#"
            style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}>
            Sign in
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
