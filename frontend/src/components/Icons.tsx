import React from 'react';

interface IconProps {
  size?: number;
  stroke?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  children, size = 16, stroke = 'currentColor', style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
    style={style}>{children}</svg>
);

export const IFile = (p: IconProps) => <Icon {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></Icon>;
export const IUpload = (p: IconProps) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5-5 5 5"/><path d="M12 5v12"/></Icon>;
export const ISearch = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>;
export const ISend = (p: IconProps) => <Icon {...p}><path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></Icon>;
export const IMessage = (p: IconProps) => <Icon {...p}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></Icon>;
export const IPin = (p: IconProps) => <Icon {...p}><path d="M12 2v6"/><path d="M5 8h14l-2 7H7z"/><path d="M12 15v7"/></Icon>;
export const IPinFilled = (p: IconProps) => <Icon {...p} style={{ ...p.style }}><path d="M12 2v6"/><path fill="currentColor" d="M5 8h14l-2 7H7z"/><path d="M12 15v7"/></Icon>;
export const IClock = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
export const ISettings = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>;
export const IArrowL = (p: IconProps) => <Icon {...p}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></Icon>;
export const IPlus = (p: IconProps) => <Icon {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Icon>;
export const IChevDown = (p: IconProps) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>;
export const IKbd = (p: IconProps) => <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></Icon>;
export const ISparkle = (p: IconProps) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Icon>;
export const ICheck = (p: IconProps) => <Icon {...p}><path d="M20 6 9 17l-5-5"/></Icon>;
export const IX = (p: IconProps) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12"/></Icon>;
export const IDots = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></Icon>;
export const ISun = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>;
export const IMoon = (p: IconProps) => <Icon {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;

export const ILogout = (p: IconProps) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></Icon>;

export const ILogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 28, style }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <rect x="4" y="3" width="20" height="26" rx="5" fill="var(--bg-soft)" stroke="var(--ink)" strokeWidth="1.4"/>
    <rect x="8" y="7" width="24" height="22" rx="5" fill="var(--accent)" stroke="var(--ink)" strokeWidth="1.4"/>
    <circle cx="20" cy="18" r="3.2" fill="var(--bg)"/>
  </svg>
);
