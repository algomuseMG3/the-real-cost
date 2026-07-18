/**
 * seedData.ts
 * 
 * This file contains the default demo data that loads when
 * a new user opens the app for the first time.
 * 
 * It has 3 parts:
 * 1. SEED_USER    → default user profile (name, age, hourly value)
 * 2. SEED_HABITS  → 4 demo habits with hours, costs and weekly progress
 * 3. SEED_MILESTONES → achievements, some earned some still locked
 * 
 * Key things I learned:
 * 
 * - startHours = where the user began tracking (e.g. 3.5h/day)
 * - dailyHours = where they are now (e.g. 2.0h/day)
 * - difference between these = hours reclaimed
 *
 * 
 * - weeklyData = 6 numbers showing hours per week for the journey graph
 *   right now this is hardcoded/fake
 *   FUTURE: I will replace this with real daily log data
 * 
 * - milestone ids like ms-1, ms-2 are unique labels
 *   so the app can find and update specific milestones
 *   similar to roll numbers in college
 *
 
 */
export interface Habit {
  id: string;
  name: string;
  icon: string;
  dailyHours: number;
  dailyCost: number; // in currency
  trend: 'improving' | 'worsening' | 'stable';
  startHours: number;
  weeklyData: number[]; // Hours spent per week over the last 6 weeks
  subCopy: string;
  log?: { date: string; hours: number }[];
}

export interface UserState {
  name: string;
  age: number;
  streakDays: number;
  weekStart: string;
  hourlyValue: number; // Estimated value of their time per hour
  currency: string;
}

export interface Milestone {
  id: string;
  name: string;
  earned: boolean;
  progress: number;
  target: number;
  unit: string;
  description: string;
}

// Add this function above SEED_USER
export function getCurrentWeekRange(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[monday.getMonth()]} ${monday.getDate()} – ${months[sunday.getMonth()]} ${sunday.getDate()}`;
}

export const SEED_USER: UserState = {
  name: "Monika",
  age: 19,
  streakDays: 1,
  weekStart: getCurrentWeekRange(),
  hourlyValue: 200, // ₹500 per hour
  currency: "₹"
};

export const SEED_HABITS: Habit[] = [
  {
    id: "habit-1",
    name: "Late-night scrolling",
    icon: "Smartphone",
    dailyHours: 2.0,
    startHours: 3.5,
    dailyCost: 3, //mobile data cost per day approx
    trend: "improving",
    weeklyData: [24.5, 22.0, 18.0,16.0,14.5,14.0],
    subCopy: "Your late-night scrolling is decreasing"
  },
  {
    id: "habit-2",
    name: "Passive streaming",
    icon: "Tv",
    dailyHours: 1.5,
    startHours: 3.0,
    dailyCost: 14, // e.g. ott platform subscription / rupees399 Netflix/ 28 days= 14rupees/day
    trend: "improving",
    weeklyData: [21.0, 19.0, 16.5, 14.0, 12.0, 9.8],
    subCopy: "You’re building a more intentional routine"
  },
  {
    id: "habit-3",
    name: "Mindless tab switching",
    icon: "Laptop",
    dailyHours: 1.0,
    startHours: 2.0,
    dailyCost: 0,
    trend: "improving",
    weeklyData: [14.0, 12.0, 10.0, 9.0, 8.0, 7.0],
    subCopy: "Your focus time is slowly increasing"
  },
  {
    id: "habit-4",
    name: "Impulse online browsing",
    icon: "ShoppingBag",
    dailyHours: 0.3,
    startHours: 0.7,
    dailyCost: 120, //buying and mobile data used
    trend: "improving",
    weeklyData: [4.9, 4.2, 3.5, 2.8, 2.4, 2.1],
    subCopy: "Small savings adding up"
  }
];

export const SEED_MILESTONES: Milestone[] = [
  {
    id: "ms-1",
    name: "First mindful week",
    earned: true,
    progress: 1,
    target: 1,
    unit: "week",
    description: "You completed 7 consecutive days of logging and reflecting."
  },
  {
    id: "ms-2",
    name: "30 hours reclaimed",
    earned: true,
    progress: 32,
    target: 30,
    unit: "hours",
    description: "Time gently shifted back toward your own intentions."
  },
  {
    id: "ms-3",
    name: "₹5,000 saved",
    earned: true,
    progress: 5400,
    target: 5000,
    unit: "₹",
    description: "Small daily decisions accumulating into meaningful reserves."
  },
  {
    id: "ms-4",
    name: "A distraction-free evening",
    earned: true,
    progress: 1,
    target: 1,
    unit: "evening",
    description: "An entire evening spent entirely offline."
  },
  {
    id: "ms-5",
    name: "One consistent month",
    earned: false,
    progress: 12,
    target: 30,
    unit: "days",
    description: "Noticing and gently adjusting your patterns for 30 days."
  },
  {
    id: "ms-6",
    name: "100 hours reclaimed",
    earned: false,
    progress: 32,
    target: 100,
    unit: "hours",
    description: "A profound return of time and mental space."
  }
];

export const ROTATING_QUOTES = [
  "Small changes are beginning to compound.",
  "Every hour reclaimed is an hour earned.",
  "Your future self will thank you for today.",
  "Awareness is the first step to change.",
  "You are more intentional than yesterday."
];
