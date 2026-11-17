import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Trip = {
  id: string; title: string; theme: string; region: string; summary: string;
  description: string; start_date: string; nights: number; price: number;
  capacity: number; applied: number; status: "open" | "closed"; refund_policy: string;
};
export type Application = {
  id: string; trip_id: string; name: string; phone: string; people: number;
  referrer: string | null; created_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const demoMode = !(url && key);
const db: SupabaseClient | null = demoMode ? null : createClient(url!, key!, { auth: { persistSession: false } });

// 데모 모드: Supabase 연결 전 화면 확인용 예시 데이터 (서버 재시작 시 초기화)
const g = globalThis as unknown as { __sipl?: { trips: Trip[]; apps: Application[] } };
g.__sipl ??= {
  apps: [],
  trips: [
    { id: "t1", title: "여성 낚시 모임과 함께하는 남해 바다낚시 1박 2일", theme: "낚시", region: "경남 남해",
      summary: "처음이어도 괜찮아요. 장비와 강사가 함께해요.",
      description: "낚시 경험이 없어도 참여할 수 있는 여성 전용 테마여행이에요.\n전문 강사가 장비 사용법부터 알려드리고, 잡은 생선으로 저녁을 함께 해요.\n\n· 1일차: 출발, 갯바위 낚시 체험, 숙소 저녁\n· 2일차: 선상 낚시, 점심, 귀가",
      start_date: "2027-04-17", nights: 1, price: 290000, capacity: 20, applied: 0, status: "open",
      refund_policy: "출발 7일 전까지 전액 환불, 3일 전까지 50% 환불, 이후 환불 불가" },
    { id: "t2", title: "통영 섬마을 선상낚시와 시장 투어", theme: "낚시", region: "경남 통영",
      summary: "잔잔한 바다에서 선상낚시, 오후엔 중앙시장 구경",
      description: "배 위에서 편하게 앉아 즐기는 선상낚시예요.\n오후에는 통영 중앙시장과 동피랑 마을을 천천히 걸어요.",
      start_date: "2027-05-22", nights: 0, price: 120000, capacity: 15, applied: 0, status: "open",
      refund_policy: "출발 7일 전까지 전액 환불, 3일 전까지 50% 환불, 이후 환불 불가" },
  ],
};
const mem = g.__sipl;

export async function listTrips(): Promise<Trip[]> {
  if (!db) return mem.trips;
  const { data, error } = await db.from("trips_with_count").select("*").order("start_date");
  if (error) throw error; return data as Trip[];
}
export async function getTrip(id: string): Promise<Trip | null> {
  if (!db) return mem.trips.find((t) => t.id === id) ?? null;
  const { data } = await db.from("trips_with_count").select("*").eq("id", id).maybeSingle();
  return (data as Trip) ?? null;
}
export async function createApplication(a: Omit<Application, "id" | "created_at">) {
  if (!db) {
    const t = mem.trips.find((x) => x.id === a.trip_id);
    if (!t) throw new Error("trip");
    if (t.applied + a.people > t.capacity) throw new Error("full");
    t.applied += a.people;
    mem.apps.unshift({ ...a, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    return;
  }
  const { error } = await db.rpc("apply_trip", {
    p_trip: a.trip_id, p_name: a.name, p_phone: a.phone, p_people: a.people, p_referrer: a.referrer,
  });
  if (error) throw new Error(error.message.includes("full") ? "full" : error.message);
}
export async function listApplications(): Promise<(Application & { trip_title: string })[]> {
  if (!db) return mem.apps.map((a) => ({ ...a, trip_title: mem.trips.find((t) => t.id === a.trip_id)?.title ?? "" }));
  const { data, error } = await db.from("applications").select("*, trips(title)").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((a: any) => ({ ...a, trip_title: a.trips?.title ?? "" }));
}
export async function createTrip(t: Omit<Trip, "id" | "applied" | "status">) {
  if (!db) { mem.trips.push({ ...t, id: crypto.randomUUID().slice(0, 8), applied: 0, status: "open" }); return; }
  const { error } = await db.from("trips").insert(t); if (error) throw error;
}

export const won = (n: number) => n.toLocaleString("ko-KR") + "원";
export const dateKo = (d: string, nights = 0) => {
  const s = new Date(d + "T00:00:00");
  const f = (x: Date) => `${x.getMonth() + 1}월 ${x.getDate()}일`;
  if (!nights) return `${s.getFullYear()}년 ${f(s)} (당일)`;
  const e = new Date(s); e.setDate(e.getDate() + nights);
  return `${s.getFullYear()}년 ${f(s)} ~ ${f(e)} (${nights}박 ${nights + 1}일)`;
};

// 실제 운영(Supabase 연결)에서는 ADMIN_PASSWORD 가 없으면 관리자 화면을 잠가요.
export const adminPassword = process.env.ADMIN_PASSWORD || (demoMode ? "demo" : crypto.randomUUID());
