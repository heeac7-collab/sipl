import Link from "next/link";
import { notFound } from "next/navigation";
import { MENUS } from "../../../lib/menus";
import Icon from "../../Icon";
export default async function Soon({ params }: { params: Promise<{ menu: string }> }) {
  const { menu } = await params;
  const m = MENUS.find((x) => x.key === menu);
  if (!m) notFound();
  return (<>
    <header className="top"><Link href="/" className="sm">← 홈</Link><span className="logo">시플</span><span style={{ width: 40 }} /></header>
    <section className="sec" style={{ textAlign: "center", paddingTop: 48 }}>
      <div className="tile" style={{ margin: "0 auto 16px" }}><Icon d={m.icon} size={40} /></div>
      <h2 style={{ display: "block" }}>{m.name}</h2>
      <p className="meta">{m.desc}</p>
      <p className="box" style={{ marginTop: 20 }}>곧 열려요. 지금은 테마여행부터 시작하고 있어요.</p>
      <Link href="/trips" className="btn" style={{ marginTop: 20 }}>테마여행 보러 가기</Link>
    </section>
  </>);
}
