export default function Icon({ d, size = 30 }: { d: string; size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#sg)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFAB8A" /><stop offset="1" stopColor="#FF7900" /></linearGradient></defs>
    <path d={d} /></svg>);
}
