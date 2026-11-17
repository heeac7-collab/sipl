import { cookies } from "next/headers";
import { listApplications, listTrips, demoMode, adminPassword } from "../../lib/data";
import { adminLogin, addTrip } from "../actions";
export const dynamic = "force-dynamic";

export default async function Admin() {
  const ok = (await cookies()).get("sipl_admin")?.value === adminPassword;
  if (!ok) return (<section className="sec"><h2>관리자 로그인</h2>
    <form action={adminLogin}><input name="pw" type="password" placeholder="비밀번호" />{demoMode && <p className="meta">데모 비밀번호: demo</p>}<button className="btn" style={{ marginTop: 12 }}>들어가기</button></form></section>);
  const [trips, apps] = await Promise.all([listTrips(), listApplications()]);
  const repeat = new Set(apps.map((a) => a.phone).filter((p, i, arr) => arr.indexOf(p) !== i)).size;
  return (<>
    <header className="top"><span className="logo">시플 관리자</span></header>
    <section className="sec"><h2>현황</h2>
      <div className="steps"><div><b>{trips.length}</b>여행</div><div><b>{apps.reduce((s, a) => s + a.people, 0)}</b>신청 인원</div><div><b>{repeat}</b>재참여자</div></div>
    </section>
    <section className="sec"><h2>신청자 명단</h2>
      <table><thead><tr><th>이름</th><th>연락처</th><th>인원</th><th>여행</th><th>소개</th></tr></thead>
        <tbody>{apps.map((a) => <tr key={a.id}><td>{a.name}</td><td>{a.phone}</td><td>{a.people}</td><td>{a.trip_title.slice(0, 12)}</td><td>{a.referrer ?? ""}</td></tr>)}</tbody></table>
      {!apps.length && <p className="meta">아직 신청자가 없어요.</p>}
    </section>
    <section className="sec"><h2>여행 등록</h2>
      <form action={addTrip}>
        <label>제목</label><input name="title" required />
        <div className="row"><div><label>테마</label><input name="theme" defaultValue="낚시" /></div><div><label>지역</label><input name="region" required /></div></div>
        <label>한 줄 소개</label><input name="summary" />
        <label>상세 설명</label><textarea name="description" rows={5} />
        <div className="row"><div><label>출발일</label><input name="start_date" type="date" required /></div><div><label>숙박(박)</label><input name="nights" type="number" defaultValue={0} min={0} /></div></div>
        <div className="row"><div><label>가격(원)</label><input name="price" type="number" required /></div><div><label>정원</label><input name="capacity" type="number" required /></div></div>
        <label>환불 규정</label><textarea name="refund_policy" rows={2} defaultValue="출발 7일 전까지 전액 환불, 3일 전까지 50% 환불, 이후 환불 불가" />
        <button className="btn" style={{ marginTop: 16 }}>등록하기</button>
      </form>
    </section>
  </>);
}
