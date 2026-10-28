import { describe, it, expect } from "vitest";
import { computeApplicationStats, computeMessageStats, decisionOf, StatsApplication } from "./adminStats";

const now = new Date(2026, 9, 28, 10, 0, 0); // 28 Oct 2026, local time

let n = 0;
const app = (over: Partial<StatsApplication>): StatsApplication => ({
  id: `id-${n++}`,
  first_name: "Hery",
  last_name: "Rakoto",
  tracking_code: null,
  program: "Licence en Informatique",
  education_level: "Baccalauréat",
  status: "pending",
  created_at: new Date(2026, 9, 15, 12).toISOString(),
  ...over,
});

describe("decisionOf", () => {
  it("treats anything not accepted or rejected as still waiting", () => {
    expect(decisionOf(null)).toBe("pending");
    expect(decisionOf("reviewing")).toBe("pending");
    expect(decisionOf("accepted")).toBe("accepted");
    expect(decisionOf("rejected")).toBe("rejected");
  });
});

describe("computeApplicationStats", () => {
  it("counts applications per status", () => {
    const s = computeApplicationStats(
      [app({ status: "pending" }), app({ status: null }), app({ status: "accepted" }), app({ status: "rejected" })],
      now,
    );
    expect(s).toMatchObject({ total: 4, pending: 2, accepted: 1, rejected: 1 });
  });

  it("computes the acceptance rate over decided applications only", () => {
    const s = computeApplicationStats(
      [app({ status: "accepted" }), app({ status: "accepted" }), app({ status: "accepted" }), app({ status: "rejected" }), app({ status: "pending" })],
      now,
    );
    expect(s.acceptanceRate).toBe(75);
  });

  it("has no acceptance rate when nothing is decided", () => {
    expect(computeApplicationStats([app({ status: "pending" })], now).acceptanceRate).toBeNull();
  });

  it("groups applications by program with their statuses, biggest first", () => {
    const s = computeApplicationStats(
      [
        app({ program: "MBA", status: "accepted" }),
        app({ program: "Licence en Informatique", status: "pending" }),
        app({ program: "Licence en Informatique", status: "rejected" }),
      ],
      now,
    );
    expect(s.byProgram).toEqual([
      { program: "Licence en Informatique", total: 2, pending: 1, accepted: 0, rejected: 1 },
      { program: "MBA", total: 1, pending: 0, accepted: 1, rejected: 0 },
    ]);
  });

  it("counts the last 6 months including the current one, oldest first", () => {
    const s = computeApplicationStats(
      [
        app({ created_at: new Date(2026, 9, 2, 12).toISOString() }),
        app({ created_at: new Date(2026, 9, 20, 12).toISOString() }),
        app({ created_at: new Date(2026, 4, 10, 12).toISOString() }),
        app({ created_at: new Date(2026, 3, 10, 12).toISOString() }), // April: outside the window
      ],
      now,
    );
    expect(s.byMonth.map((m) => m.month)).toEqual(["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"]);
    expect(s.byMonth.map((m) => m.count)).toEqual([1, 0, 0, 0, 0, 2]);
    expect(s.thisMonth).toBe(2);
  });

  it("lists the 5 oldest waiting applications with their days of waiting", () => {
    const apps = [1, 2, 3, 4, 5, 6].map((day) => app({ id: `d${day}`, created_at: new Date(2026, 9, day, 10).toISOString() }));
    apps.push(app({ id: "done", status: "accepted", created_at: new Date(2026, 0, 1).toISOString() }));
    const s = computeApplicationStats(apps, now);
    expect(s.oldestPending.map((a) => a.id)).toEqual(["d1", "d2", "d3", "d4", "d5"]);
    expect(s.oldestPending[0].daysWaiting).toBe(27);
  });
});

describe("computeMessageStats", () => {
  it("counts messages not yet answered as waiting", () => {
    expect(computeMessageStats([{ status: "responded" }, { status: "pending" }, { status: null }])).toEqual({
      total: 3,
      responded: 1,
      pending: 2,
    });
  });
});
