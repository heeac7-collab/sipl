import Link from "next/link";
import { MENUS } from "../../lib/menus";
import Icon from "../Icon";
export default function Menu() {
  return (<>
    <header className="top"><span className="logo">시플</span><span>전체 메뉴</span></header>
    <section className="sec">
      <Link href="/trips" className="mrow"><b>테마여행</b><span className="tag">모집 중</span></Link>
      {MENUS.map((m) => <Link key={m.key} href={`/soon/${m.key}`} className="mrow"><span style={{ display: "flex", gap: 12, alignItems: "center" }}><Icon d={m.icon} size={26} />{m.name}</span><span className="meta">곧 열려요</span></Link>)}
    </section>
  </>);
}
