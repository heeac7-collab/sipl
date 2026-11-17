import Link from "next/link";
import { listTrips } from "../lib/data";
import { MENUS } from "../lib/menus";
import TripCard from "./TripCard";
import Icon from "./Icon";

export const dynamic = "force-dynamic";

const Soon = ({ k, title }: { k: string; title: string }) => (
  <h2>{title} <Link href={`/soon/${k}`} className="pill">곧 열려요</Link></h2>
);
const Img = ({ c, h = 72, w, round }: { c: number; h?: number; w?: number | string; round?: boolean }) => (
  <div className={"ph p" + (c % 4)} style={{ height: h, width: w ?? h, borderRadius: round ? "50%" : 10 }} />
);

export default async function Home() {
  const trips = (await listTrips()).filter((t) => t.status === "open");
  return (
    <>
      <header className="top center">
        <span className="logo navy">시플<i /></span>
        <Link href="/login" className="bell" aria-label="로그인">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" /></svg>
        </Link>
      </header>

      <div className="slides">
        <Link href="/trips" className="slide s0"><b>취향이 같은 사람들과<br />떠나는 테마여행</b><span>지금 모집 중</span></Link>
        <Link href="/soon/influencer" className="slide s1"><b>시플에서<br />시니어 라이프를 공유해보세요!</b></Link>
        <Link href="/soon/club" className="slide s2"><b>같은 취미, 같은 세대<br />시플클럽에서 만나요</b></Link>
      </div>
      <div className="dots"><i className="on" /><i /><i /></div>

      <nav className="grid">
        {MENUS.map((m) => (
          <Link key={m.key} href={`/soon/${m.key}`}><span className="tile"><Icon d={m.icon} /></span>{m.name}</Link>
        ))}
      </nav>

      <section className="sec">
        <h2>모집 중인 테마여행 <Link href="/trips">더보기</Link></h2>
        {trips.slice(0, 2).map((t, i) => <TripCard key={t.id} t={t} i={i} />)}
      </section>

      <section className="sec preview">
        <Soon k="influencer" title="인기 시플루언서" />
        <div className="hrow">{["여행 크리에이터", "패션 크리에이터", "시니어 작가"].map((n, i) => <div key={n} className="ctr"><Img c={i} h={96} round /><p>{n}</p></div>)}</div>
      </section>

      <section className="sec preview">
        <Soon k="club" title="참여도가 높은 클럽" />
        {["시플 낚시 클럽", "시플 등산 클럽", "시플 미라클 모닝"].map((n, i) => (
          <div key={n} className="lrow"><Img c={i + 1} h={56} round /><div style={{ flex: 1 }}><b>{n}</b><p className="meta">취미 · 정기 모임</p></div><span className="join">가입신청</span></div>
        ))}
      </section>

      <section className="sec preview">
        <Soon k="community" title="커뮤니티 인기게시글" />
        {["시플활동 재미있어요!", "시니어 유튜버 저도 도전하려구요", "남편이랑 캠핑다니는데 좋네요"].map((n) => <p key={n} className="post">{n}</p>)}
      </section>

      <section className="sec preview">
        <Soon k="hotplace" title="추천하는 이번주 핫플" />
        {["서울둘레길 1코스 수락산", "쌍암공원, 호수와 여유", "탄금대 왕갈비탕"].map((n, i) => (
          <div key={n} className="lrow"><Img c={i + 2} h={96} w={150} /><div><p className="meta">시플추천</p><b>{n}</b></div></div>
        ))}
      </section>

      {[["health", "시플 건강", "매일 아침 마시기 좋은 7가지 주스 레시피"], ["fashion", "시플 패션", "시니어 패션, 유행을 말하다"]].map(([k, t, h], i) => (
        <section key={k} className="sec preview">
          <Soon k={k} title={t} />
          <div className={"feature ph p" + (i + 1)}><b>{h}</b></div>
        </section>
      ))}

      <section className="sec preview">
        <Soon k="class" title="시플교실" />
        <div className="hrow">{["내가 브랜드가 되는 방법", "집에서도 하는 필라테스", "생각이 돈이 되게 하는 방법"].map((n, i) => <div key={n} className="ctr"><Img c={i} h={100} w="100%" /><p>{n}</p></div>)}</div>
      </section>

      <section className="sec preview">
        <Soon k="money" title="꿀머니 정보" />
        {[["채권이란?", "알기 쉬운 금융 상식"], ["펀드란?", "알기 쉬운 금융 상식"], ["한국의 기준 금리", "알아두면 좋은 금융 상식"]].map(([a, b], i) => (
          <div key={a} className="lrow"><Img c={i + 3} h={72} w={84} /><div><b>{a}</b><p className="meta">{b}</p></div></div>
        ))}
      </section>

      <section className="sec preview">
        <Soon k="market" title="시플 마켓" />
        <div className="feature ph p3"><b>함께할수록 저렴해진다<br />시플마켓 회원 특가</b></div>
      </section>
    </>
  );
}
