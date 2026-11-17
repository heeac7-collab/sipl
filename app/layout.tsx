import "./globals.css";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { demoMode } from "../lib/data";

export const metadata: Metadata = {
  title: "시니어플레이스 시플 | 5060 테마여행",
  description: "5060을 위한 취향 기반 테마여행과 모임. 낚시 테마여행부터 시작해요.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "시플", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};
export const viewport: Viewport = { themeColor: "#FF7900", width: "device-width", initialScale: 1 };

const I = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={d} /></svg>;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
      </head>
      <body>
        <div className="app">
          {demoMode && <div className="demo">데모 화면이에요. 예시 데이터이며 신청 내용은 저장되지 않아요.</div>}
          {children}
          <footer className="foot">
            <details><summary>시니어플레이스(시플) <span>사업자정보 ▾</span></summary><p style={{ marginTop: 8 }}>사업자 정보 준비 중</p></details>
            <p style={{ marginTop: 8 }}>
            <Link href="/terms">이용약관</Link> · <Link href="/privacy">개인정보처리방침</Link></p>
          </footer>
        </div>
        <nav className="nav">
          <Link href="/menu">{I("M4 6h16M4 12h16M4 18h16")}전체</Link>
          <Link href="/" className="home">홈</Link>
          <Link href="/my">{I("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0")}마이페이지</Link>
        </nav>
      </body>
    </html>
  );
}
