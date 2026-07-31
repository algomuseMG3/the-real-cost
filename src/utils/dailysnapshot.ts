// ─── dailySnapshots.ts ───────────────────────────────────────────────────────
// Manages the daily snapshot store that powers the 7-day rolling graph.
// Each day one snapshot is stored: { date, totalLost, totalReclaimed }
// On reload, the last 7 snapshots are read and passed directly to JourneyGraph.

export interface DailySnapshot {
  date: string;          // "YYYY-MM-DD"
  totalLost: number;     // sum of all habit hours that day
  totalReclaimed: number; // baseline - totalLost (never negative)
}

const SNAPSHOT_KEY = 'real_cost_daily_snapshots_v1';
const MAX_DAYS = 90; // keep up to 90 days of history, graph shows last 7

// ── Read / Write ─────────────────────────────────────────────────────────────

export function loadSnapshots(): DailySnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DailySnapshot[];
  } catch {
    return [];
  }
}

export function saveSnapshots(snapshots: DailySnapshot[]): void {
  // Keep only the most recent MAX_DAYS entries
  const trimmed = snapshots
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-MAX_DAYS);
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(trimmed));
}

// ── Core update ───────────────────────────────────────────────────────────────
// Call this every time the user updates habit hours.
// It upserts today's snapshot and saves.

export function upsertTodaySnapshot(
  habits: { dailyHours: number; startHours: number }[]
): DailySnapshot[] {
  const today = getTodayString();
  const totalLost = Number(
    habits.reduce((s, h) => s + h.dailyHours, 0).toFixed(2)
  );
  const baseline = habits.reduce((s, h) => s + h.startHours, 0);
  const totalReclaimed = Number(Math.max(0, baseline - totalLost).toFixed(2));

  const snapshots = loadSnapshots();
  const existing = snapshots.findIndex(s => s.date === today);

  if (existing >= 0) {
    snapshots[existing] = { date: today, totalLost, totalReclaimed };
  } else {
    snapshots.push({ date: today, totalLost, totalReclaimed });
  }

  saveSnapshots(snapshots);
  return snapshots;
}

// ── 7-day rolling window ──────────────────────────────────────────────────────
// Returns exactly 7 entries for the graph.
// Days with no real log get a smart fallback (baseline or last known value).

export function getLast7DaysGraphData(
  habits: { dailyHours: number; startHours: number }[]
): { day: string; lost: number; reclaimed: number }[] {
  const snapshots = loadSnapshots();
  const baseline = habits.reduce((s, h) => s + h.startHours, 0);
  const currentLost = Number(habits.reduce((s, h) => s + h.dailyHours, 0).toFixed(2));

  // Build a lookup map for fast access
  const map: Record<string, DailySnapshot> = {};
  snapshots.forEach(s => { map[s.date] = s; });

  // Generate the last 7 calendar days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // Fill in each day
  let lastKnownLost = baseline; // start at baseline if no history
  return days.map(date => {
    const label = getDayLabel(date);

    if (map[date]) {
      // Real logged data exists
      lastKnownLost = map[date].totalLost;
      return {
        day: label,
        lost: map[date].totalLost,
        reclaimed: map[date].totalReclaimed,
      };
    }

    const isToday = date === getTodayString();
    if (isToday) {
      // Today with no snapshot yet — use current habit state
      const reclaimed = Number(Math.max(0, baseline - currentLost).toFixed(2));
      return { day: label, lost: currentLost, reclaimed };
    }

    // Past day with no data — interpolate gently toward current
    // This avoids a completely flat line when there's partial history
    const interpolated = Number(
      ((lastKnownLost + currentLost) / 2).toFixed(2)
    );
    const reclaimed = Number(Math.max(0, baseline - interpolated).toFixed(2));
    return { day: label, lost: interpolated, reclaimed };
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  // Use UTC to avoid timezone shift on label
  const utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][utc.getDay()];
}