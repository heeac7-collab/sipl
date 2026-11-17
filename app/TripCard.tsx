import Link from "next/link";
import { Trip, won, dateKo } from "../lib/data";

export default function TripCard({ t, i = 0 }: { t: Trip; i?: number }) {
  const left = t.capacity - t.applied;
  return (
    <Link href={`/trips/${t.id}`} className="card">
      <div className={"thumb" + (i % 2 ? " b" : "")}>{t.region}</div>
      <div className="in">
        <span className="tag">{t.theme} 테마여행</span>
        <h3 style={{ marginTop: 8 }}>{t.title}</h3>
        <p className="meta">{dateKo(t.start_date, t.nights)}</p>
        <p className="price">{won(t.price)}</p>
        <div className="bar"><i style={{ width: `${Math.min(100, (t.applied / t.capacity) * 100)}%` }} /></div>
        <p className="meta">{left > 0 ? `남은 자리 ${left}명 / 정원 ${t.capacity}명` : "모집 마감"}</p>
      </div>
    </Link>
  );
}
