export interface StatsApplication {
  id: string;
  first_name: string;
  last_name: string;
  tracking_code: string | null;
  program: string;
  education_level: string;
  status: string | null;
  created_at: string;
}

export interface StatsMessage {
  status: string | null;
}

export type Decision = "pending" | "accepted" | "rejected";

/** Every application that is neither accepted nor rejected still needs a decision. */
export const decisionOf = (status: string | null): Decision =>
  status === "accepted" ? "accepted" : status === "rejected" ? "rejected" : "pending";

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const DAY_MS = 24 * 60 * 60 * 1000;

export const MONTHS_SHOWN = 6;
export const OLDEST_PENDING_SHOWN = 5;

export function computeApplicationStats(apps: StatsApplication[], now: Date = new Date()) {
  let pending = 0;
  let accepted = 0;
  let rejected = 0;
  const currentMonth = monthKey(now);
  let thisMonth = 0;

  const programs = new Map<string, { program: string; total: number; pending: number; accepted: number; rejected: number }>();
  const levels = new Map<string, number>();

  const months: { month: string; count: number }[] = [];
  for (let i = MONTHS_SHOWN - 1; i >= 0; i--) {
    months.push({ month: monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)), count: 0 });
  }
  const monthIndex = new Map(months.map((m, i) => [m.month, i]));

  for (const app of apps) {
    const decision = decisionOf(app.status);
    if (decision === "pending") pending++;
    else if (decision === "accepted") accepted++;
    else rejected++;

    const created = new Date(app.created_at);
    const key = monthKey(created);
    if (key === currentMonth) thisMonth++;
    const idx = monthIndex.get(key);
    if (idx !== undefined) months[idx].count++;

    const p = programs.get(app.program) ?? { program: app.program, total: 0, pending: 0, accepted: 0, rejected: 0 };
    p.total++;
    p[decision]++;
    programs.set(app.program, p);

    levels.set(app.education_level, (levels.get(app.education_level) ?? 0) + 1);
  }

  const decided = accepted + rejected;

  const oldestPending = apps
    .filter((a) => decisionOf(a.status) === "pending")
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, OLDEST_PENDING_SHOWN)
    .map((a) => ({
      ...a,
      daysWaiting: Math.max(0, Math.floor((now.getTime() - new Date(a.created_at).getTime()) / DAY_MS)),
    }));

  return {
    total: apps.length,
    pending,
    accepted,
    rejected,
    /** Share of decided applications that were accepted, in whole percent; null when nothing is decided yet. */
    acceptanceRate: decided === 0 ? null : Math.round((accepted / decided) * 100),
    thisMonth,
    byProgram: [...programs.values()].sort((a, b) => b.total - a.total || a.program.localeCompare(b.program)),
    byEducationLevel: [...levels.entries()]
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => b.count - a.count || a.level.localeCompare(b.level)),
    byMonth: months,
    oldestPending,
  };
}

/** A contact message waits for an answer until the admin has responded. */
export function computeMessageStats(messages: StatsMessage[]) {
  const responded = messages.filter((m) => m.status === "responded").length;
  return { total: messages.length, responded, pending: messages.length - responded };
}
