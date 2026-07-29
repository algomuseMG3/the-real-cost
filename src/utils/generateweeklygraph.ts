export type DayLog = {
  date: string;
  habits: { name: string; hours: number }[];
};

export function generateweeklygraph(logs: DayLog[]) {
  const today = new Date();

  const weeks: string[] = [];
  const hoursLostData: number[] = [];
  const hoursReclaimedData: number[] = [];

  let baseline = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { weekday: "short" });

    const found = logs.find(l => l.date === dateStr);

    const totalLost = found
      ? found.habits.reduce((sum, h) => sum + h.hours, 0)
      : 0;

    if (baseline === 0 && totalLost > 0) {
      baseline = totalLost;
    }

    const reclaimed = baseline > 0 ? baseline - totalLost : 0;

    weeks.push(label);
    hoursLostData.push(totalLost);
    hoursReclaimedData.push(reclaimed);
  }

  return { weeks, hoursLostData, hoursReclaimedData };
}