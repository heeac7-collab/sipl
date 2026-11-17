import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrip, won, dateKo } from "../../../lib/data";
import ApplyForm from "./ApplyForm";
export const dynamic = "force-dynamic";

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTrip((await params).id);
  if (!t) notFound();
  const left = t.capacity - t.applied;
  return (<>
    <header className="top"><Link href="/trips" className="sm">← 목록</Link><span className="logo">시플</span><span style={{ width: 40 }} /></header>
    <div className="thumb" style={{ height: 200 }}>{t.region}</div>
    <section className="sec">
      <span className="tag">{t.theme} 테마여행</span>
      <h2 style={{ marginTop: 8, display: "block" }}>{t.title}</h2>
      <p className="meta">{t.summary}</p>
      <div className="box">
        <b>일정</b> {dateKo(t.start_date, t.nights)}{"\n"}<b>지역</b> {t.region}{"\n"}<b>가격</b> 1인 {won(t.price)}{"\n"}<b>모집</b> 남은 자리 {Math.max(0, left)}명 / 정원 {t.capacity}명
      </div>
    </section>
    <section className="sec"><h2>여행 소개</h2><p style={{ whiteSpace: "pre-line" }}>{t.description}</p></section>
    <section className="sec"><h2>환불 규정</h2><p className="box">{t.refund_policy}</p></section>
    <section className="sec"><h2>신청하기</h2><ApplyForm tripId={t.id} left={left} /></section>
  </>);
}
