"use client";
import { useActionState } from "react";
import { apply } from "../../../app/actions";

export default function ApplyForm({ tripId, left }: { tripId: string; left: number }) {
  const [s, act, pending] = useActionState(apply, null as null | { ok?: boolean; error?: string });
  if (s?.ok) return <div className="ok">신청이 접수됐어요!<br />담당자가 1~2일 안에 문자로 일정과 입금 안내를 보내드려요.</div>;
  if (left <= 0) return <button className="btn" disabled>모집이 마감됐어요</button>;
  return (
    <form action={act} id="apply">
      <input type="hidden" name="trip_id" value={tripId} />
      <label htmlFor="name">이름</label>
      <input id="name" name="name" autoComplete="name" required />
      <label htmlFor="phone">휴대폰 번호</label>
      <input id="phone" name="phone" inputMode="numeric" autoComplete="tel" placeholder="010-1234-5678" required />
      <label htmlFor="people">인원</label>
      <select id="people" name="people" defaultValue="1">
        {Array.from({ length: Math.min(4, left) }, (_, i) => <option key={i} value={i + 1}>{i + 1}명</option>)}
      </select>
      <label htmlFor="referrer">소개해 준 분 (선택)</label>
      <input id="referrer" name="referrer" placeholder="모임 이름이나 소개해 준 분 성함" />
      <label className="chk"><input type="checkbox" name="agree" />개인정보 수집·이용과 환불 규정에 동의해요</label>
      {s?.error && <div className="err">{s.error}</div>}
      <button className="btn" style={{ marginTop: 16 }} disabled={pending}>{pending ? "신청 중..." : "신청하기"}</button>
    </form>
  );
}
