# the real cost

> A behavioral self-awareness platform that transforms daily habits into measurable emotional and financial insights.

🔗 **Live Demo:** [the-real-cost-eight.vercel.app](https://the-real-cost-eight.vercel.app)

---

## What it does

Most people underestimate the long-term impact of small daily habits because the consequences are invisible in the moment.

**The Real Cost** makes them visible — converting daily habits into:
- ⏱ Yearly time loss (in hours and days)
- 💰 Monetary opportunity cost (₹ per year)
- 📊 Life percentage consumed (waking hours)
- 📈 7-day rolling progress graph from real daily logs
- 🎯 Identity milestones based on actual progress

---

## Features

- **Personalized onboarding** — collects your real habit and baseline hours
- **Daily check-in** — log today's actual hours on each habit card
- **Live calculations** — all metrics recalculate instantly as you log
- **7-day rolling graph** — built from real daily snapshots, not fake data
- **Future projection** — what 1 year of improvement looks like
- **Waking life footprint** — interactive slider showing % of life consumed
- **localStorage persistence** — your data survives page refreshes
- **No leaderboards. No guilt. Self-comparison only.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Persistence | localStorage |
| Deployment | Vercel |

---

## Core Calculation Functions

```ts
calcTimeCost(dailyHours, hourlyValue)
// yearly opportunity cost of time

calcMoneySaved(dailySpend, daysTracked)  
// direct money saved over streak

calcLifePercent(hoursLost, age, lifeExpectancy)
// % of remaining waking life consumed

calcYearlyProjection(weeklyHours)
// annual hours from weekly rate

calcOpportunityCost(hoursReclaimed, valuePerHour)
// monetary value of reclaimed time

calcCoursesCompletable(yearlyHours)
// full courses possible with reclaimed hours
```

---

## What I built

This project was built on a UI scaffold. My original contributions:

- Replaced hardcoded `onTrackPercentage` (94/75) with real formula
- Built `dailySnapshots.ts` — dedicated snapshot store for graph data
- Added daily check-in system with dated log entries
- Built 7-day rolling graph from real daily snapshots
- Added `buildWeeklyDataFromLog()` and `calcCoursesCompletable()`
- Replaced fake seed data with Indian student habits
- Fixed multiple TypeScript import conflicts and production bugs
- Configured Vercel deployment and resolved build failures

---

## Run locally

```bash
git clone https://github.com/algomuseMG3/the-real-cost
cd the-real-cost
npm install
npm run dev
```

---

## Author

**Monika Gupta**  
GitHub: [@algomuseMG3](https://github.com/algomuseMG3)
Linkedin : https://www.linkedin.com/in/monika-gupta1906/
