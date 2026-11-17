"use client";
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export default function Login() {
  const go = () => url && key && createClient(url, key).auth.signInWithOAuth({ provider: "kakao", options: { redirectTo: location.origin } });
  return (<section className="sec" style={{ paddingTop: 60, textAlign: "center" }}>
    <p className="logo" style={{ fontSize: "2.4rem" }}>시플</p>
    <p className="meta" style={{ margin: "8px 0 40px" }}>아이디·비밀번호 없이 카카오로 시작해요</p>
    <button className="btn k" onClick={go} disabled={!url}>카카오로 시작하기</button>
    {!url && <p className="meta" style={{ marginTop: 12 }}>카카오 로그인은 Supabase 연결 후 사용할 수 있어요.</p>}
    <p className="meta" style={{ marginTop: 24 }}>여행 신청은 로그인 없이도 할 수 있어요.</p>
  </section>);
}
