/**
 * calculations.ts
 * 
 * All pure math functions for The Real Cost.
 * "Pure" means: same input always gives same output.
 * No side effects, no state — just math.
 * 
 * Functions I added:
 * - calcTimeCost - dailyHours * 365 * hourlyValue
 * - calcMoneySaved      - spend * days tracked
 * - calcLifePercent     - habit hours as % of waking life (16h/day)
 * - calcYearlyProjection - weekly hours * 52 weeks
 * - calcOpportunityCost  - hours * hourly value = money equivalent

 * - calcCoursesCompletable -yearly hours ÷ 40hr avg course
 * - calcWeeklyReclaimed    - sum of (startHours - dailyHours) * 7
 * -calcMoneyCost - dailyCost * 365
 
 * 
 * Key learning: these functions don't know about React or the UI.
 * They just take numbers and return numbers.
 * Components call these functions and display the results.
 */
/**
 * Pure calculation functions for "The Real Cost"
 * These functions power the reflective data storytelling without using clinical jargon.
 */
/**
 * Builds weeklyData array from real daily log entries.
 * Groups log entries by week and sums hours per week.
 * Returns array of 6 weekly totals for the journey graph.
 * @param log array of daily check-in entries with date and hours
 * @param startHours original daily hours when tracking began
 * @returns array of 6 numbers representing weekly totals
 
 */

/**
 * Calculates the annual monetary equivalent of time spent on a habit.
 * @param dailyHours Hours spent per day
 * @param hourlyValue User's estimated personal or professional value per hour
 * @returns Total yearly cost in currency
 */
export function calcTimeCost(dailyHours: number, hourlyValue: number): number {
  return Math.round(dailyHours * 365 * hourlyValue);
}

/**
 * Calculates the direct financial savings accumulated over the tracked period.
 * @param dailySpend Average daily amount previously spent on the habit
 * @param daysTracked Number of days the user has been actively reclaiming this habit
 * @returns Total money saved
 */
export function calcMoneySaved(dailySpend: number, daysTracked: number): number {
  return Math.round(dailySpend * daysTracked);
}

/**
 * Calculates the percentage of the user's remaining waking life consumed by a daily habit.
 * Assumes 16 waking hours per day.
 * @param hoursLost Daily hours spent on the habit
 * @param ageYears Current age of the user
 * @param lifeExpectancy Expected lifespan (default 80)
 * @returns Percentage of remaining waking life
 */
export function calcLifePercent(hoursLost: number, ageYears: number, lifeExpectancy: number = 80): number {
  if (ageYears >= lifeExpectancy) return 0;
  // If you spend `hoursLost` out of 16 waking hours every day, 
  // it consistently represents (hoursLost / 16) of your waking life.
  const wakingHoursPerDay = 16;
  const percent = (hoursLost / wakingHoursPerDay) * 100;
  return Number(percent.toFixed(1));
}

/**
 * Projects the yearly accumulated hours based on a weekly rate.
 * @param weeklyHours Hours spent or reclaimed per week
 * @returns Projected hours over a 52-week year
 */
export function calcYearlyProjection(weeklyHours: number): number {
  return Math.round(weeklyHours * 52);
}

/**
 * Calculates the potential value or opportunity created from reclaimed time.
 * @param hoursReclaimed Total hours reclaimed
 * @param valuePerHour Estimated value per hour
 * @returns Total opportunity value
 */
export function calcOpportunityCost(hoursReclaimed: number, valuePerHour: number): number {
  return Math.round(hoursReclaimed * valuePerHour);
}
/**
 * Calculates hoe many full courses someone could complete
 * with their reclaimed hours. Assumes avg course = 40 hours
 * @param yearlyHoursReclaimed Total hours reclaimed in a year
 * @returns number of full courses completed
 
 */
export function calcCourseCompleted(
  yearlyHoursReclaimed: number
): number {
  const avgCourseHours = 40;
  return Math.floor(yearlyHoursReclaimed / avgCourseHours);
}
/**
 * Calculates total hours reclaimed across all habits this week
 * Reclaimed= start hours- currentHours per habit, times  days
 * @param habits array of user habits
 * @returns total weekly hours reclaimed
 */
export function calcWeeklyReclaimed(
  habits : { dailyHours: number ; startHours : number } []
) : number {
  return Math.round(
    habits.reduce((total, habit) => {
      const dailyReclaimed = habit.startHours - habit.dailyHours;
      return total + (dailyReclaimed >0 ? dailyReclaimed * 7 : 0);
    },0) 
    *10 )/10;
}
import type { Habit } from '../data/seedData';

export interface GraphData {
  weeks: string[];
  hoursLostData: number[];
  hoursReclaimedData: number[];
}

/**
 * Aggregates every habit's daily logs into the last seven calendar days.
 * `startHours` is the fixed initial baseline, so reclaimed time is measured
 * against where the user began rather than against a changing daily value.
 */
export function buildLast7DaysGraphData(habits: Habit[]): GraphData {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  const weeks = days.map(day => {
    const date = new Date(day);
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  });

  const hoursByDay = new Map(days.map(day => [day, 0]));

  habits.forEach(habit => {
    habit.log?.forEach(({ date, hours }) => {
      if (hoursByDay.has(date)) {
        hoursByDay.set(date, (hoursByDay.get(date) ?? 0) + hours);
      }
    });
  });

  const initialBaseline = habits.reduce(
    (total, habit) => total + habit.startHours,
    0
  );

  const hoursLostData = days.map(day =>
    Number((hoursByDay.get(day) ?? 0).toFixed(1))
  );
  const hoursReclaimedData = hoursLostData.map(hoursLost =>
    Math.max(0, Number((initialBaseline - hoursLost).toFixed(0)))
  );

  return { weeks, hoursLostData, hoursReclaimedData };
}

/**
 * Calculates total direct money spent on a habit per year
 * @param dailyCost money spent per day on this habit
 * @returns yearly direct cost
 */
export function calcMoneyCost (dailyCost : number ) : number {
  return Math.round(dailyCost * 365);
}
export function buildWeeklyDataFromLog
(log: { date: string; hours: number }[],
  startHours: number
): number[] {
//If no real log exists, show a flat baseline
//the graph will stay flat until the user logs real data
  if (!log || log.length === 0) {
    return Array(6).fill(
      Number((startHours * 7).toFixed(1))
    );
  }

//sort log by date oldest first
const sorted = [...log].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  //group entries into weeks  7 days each
  const weeks: number[][] = [[], [], [], [], [], []];
  const firstDate = new Date(sorted[0].date).getTime();
  const msPerDay = 86400000;

  sorted.forEach(entry => {
    const daysSinceStart = Math.floor(
      (new Date(entry.date).getTime() - firstDate) / msPerDay
    );
    const weekIndex = Math.min(Math.floor(daysSinceStart / 7), 5);
    weeks[weekIndex].push(entry.hours);
  });
   // Calculate weekly total — if no entries for that week use previous week
  let lastKnown = startHours * 7;
  return weeks.map(weekEntries => {
    if (weekEntries.length === 0) return lastKnown;
    const avg = weekEntries.reduce((s, h) => s + h, 0) / weekEntries.length;
    lastKnown = Number((avg * 7).toFixed(1));
    return lastKnown;
  });
}
  
