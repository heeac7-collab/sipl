import Link from "next/link";
export default function My() {
  return (<section className="sec" style={{ paddingTop: 40 }}><h2>내 정보</h2>
    <p className="box">로그인하면 신청한 여행과 참여 기록을 볼 수 있어요.</p>
    <Link href="/login" className="btn" style={{ marginTop: 16 }}>로그인하기</Link></section>);
}
