"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createApplication, createTrip, adminPassword } from "../lib/data";

export async function apply(_: unknown, f: FormData) {
  const trip_id = String(f.get("trip_id"));
  const name = String(f.get("name") ?? "").trim();
  const phone = String(f.get("phone") ?? "").replace(/[^0-9]/g, "");
  const people = Number(f.get("people") ?? 1);
  const referrer = String(f.get("referrer") ?? "").trim() || null;
  if (!name) return { error: "이름을 입력해 주세요." };
  if (!/^01[0-9]{8,9}$/.test(phone)) return { error: "휴대폰 번호를 다시 확인해 주세요." };
  if (!f.get("agree")) return { error: "개인정보 수집·이용과 환불 규정에 동의해 주세요." };
  try { await createApplication({ trip_id, name, phone, people, referrer }); }
  catch (e) { return { error: (e as Error).message === "full" ? "남은 자리가 부족해요." : "신청 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." }; }
  return { ok: true };
}

export async function adminLogin(f: FormData) {
  const pw = adminPassword;
  if (f.get("pw") === pw) (await cookies()).set("sipl_admin", pw, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect("/admin");
}

export async function addTrip(f: FormData) {
  if ((await cookies()).get("sipl_admin")?.value !== adminPassword) redirect("/admin");
  const s = (k: string) => String(f.get(k) ?? "").trim();
  await createTrip({
    title: s("title"), theme: s("theme") || "낚시", region: s("region"), summary: s("summary"),
    description: s("description"), start_date: s("start_date"), nights: Number(s("nights") || 0),
    price: Number(s("price") || 0), capacity: Number(s("capacity") || 0), refund_policy: s("refund_policy"),
  });
  redirect("/admin");
}
