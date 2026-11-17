import Link from "next/link";
import { listTrips } from "../../lib/data";
import TripCard from "../TripCard";
export const dynamic = "force-dynamic";
export default async function Trips() {
  const trips = await listTrips();
  return (<>
    <header className="top"><Link href="/" className="logo">시플</Link><span>테마여행</span></header>
    <section className="sec">{trips.map((t, i) => <TripCard key={t.id} t={t} i={i} />)}</section>
  </>);
}
