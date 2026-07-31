/**
 * App.tsx — The brain of The Real Cost
 * 
 * This is the parent component that controls everything.
 * It holds all state and passes data down to child components.
 * 
 * State it manages:
 * - user       → name, age, currency, hourly value
 * - habits     → array of all tracked habits
 * - milestones → achievement progress
 * 
 * Key things I learned:
 * 
 * 1. localStorage — data saves automatically on every change
 *    and loads back when the app starts. No backend needed.
 * 
 * 2. Derived values — weeklyHoursReclaimed, moneySaved etc
 *    are calculated FROM state, not stored separately.
 *    When state changes, these recalculate automatically.
 * 
 * 3. Handlers — handleAddHabit, handleUpdateHours etc
 *    are functions passed DOWN to child components as props.
 *    Children call them to update parent state.
 *    This is "lifting state up" — same pattern as ConfigureModal.
 * 
 * 4. useEffect runs code when dependencies change:
 *    - on mount → loads localStorage data
 *    - on habits/user change → saves to localStorage
 * 
 * What I improved:
 * - onTrackPercentage: replaced hardcoded 94/75 with real calculation
 *   based on actual hours reclaimed vs starting hours
 * moneySaved (removed misleading fallback) -- removed fake default value (|| 150 Now only calculates when real cost data exists
 * cost savings calculation added guard: h.startHours > 0 (prevents division by zero) clamped savedFraction between 0 and 1
 * changes in the focusTimeGained with named constant
*/
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JourneyGraph } from './components/JourneyGraph';
import { HabitCards } from './components/HabitCards';
import { DailyReflection } from './components/DailyReflection';
import { FutureImpactPanel } from './components/FutureImpactPanel';
import { MilestonesPanel } from './components/MilestonesPanel';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ConfigureModal } from './components/ConfigureModal';
import { InsightsTab } from './components/InsightsTab';

import {
  SEED_USER,
  SEED_HABITS,
  SEED_MILESTONES,
  ROTATING_QUOTES,
  getCurrentWeekRange,
  Habit,
  UserState,
  Milestone
} from './data/seedData';

import {
  calcMoneySaved,
  calcYearlyProjection
} from './utils/calculations';

import {
  upsertTodaySnapshot,
  getLast7DaysGraphData
} from './utils/dailysnapshot';

const STORAGE_KEY = 'real_cost_app_state_v1';
const SNAPSHOT_KEY = 'real_cost_daily_snapshots_v1';

export default function App() {
  const isDemoRoute = typeof window !== 'undefined' && (
    window.location.pathname.includes('/demo') ||
    window.location.search.includes('demo=true')
  );

  // ── State ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<UserState>({
    ...SEED_USER,
    weekStart: getCurrentWeekRange()
  });
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);
  const [milestones, setMilestones] = useState<Milestone[]>(SEED_MILESTONES);
  const [activeTab, setActiveTab] = useState<string>('today');
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add-habit' | 'settings' | null>(null);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // ── Load state on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (isDemoRoute) {
      setUser(SEED_USER);
      setHabits(SEED_HABITS);
      setMilestones(SEED_MILESTONES);
      setIsOnboarding(false);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.habits) {
          setUser({
            ...parsed.user,
            weekStart: getCurrentWeekRange()   // always use real current week
          });
          setHabits(parsed.habits);
          setMilestones(parsed.milestones || SEED_MILESTONES);
          setIsOnboarding(false);

          // Seed today's snapshot so graph has a point even if user doesn't log
          upsertTodaySnapshot(parsed.habits);
          return;
        }
      } catch (e) {
        console.error('Failed to parse stored state', e);
      }
    } else {
      setIsOnboarding(true);
    }
  }, [isDemoRoute]);

  // ── Save state on every change ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOnboarding) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, habits, milestones }));
    }
  }, [user, habits, milestones, isOnboarding]);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const totalStartDailyHours = habits.reduce((sum, h) => sum + h.startHours, 0);
  const totalCurrentDailyHours = habits.reduce((sum, h) => sum + h.dailyHours, 0);

  const dailyHoursReclaimedPerDay = Math.max(0, totalStartDailyHours - totalCurrentDailyHours);
  const weeklyHoursReclaimed = Number((dailyHoursReclaimedPerDay * 7).toFixed(1));

  const totalDailyCostSaved = habits.reduce((sum, h) => {
    if (h.dailyCost > 0 && h.dailyHours < h.startHours && h.startHours > 0) {
      const rawFraction = (h.startHours - h.dailyHours) / h.startHours;
      const savedFraction = Math.min(1, Math.max(0, rawFraction));
      return sum + (h.dailyCost * savedFraction);
    }
    return sum;
  }, 0);

  const moneySaved = totalDailyCostSaved > 0
    ? calcMoneySaved(totalDailyCostSaved, user.streakDays)
    : 0;

  const FOCUS_CONVERSION_RATE = 0.85;
  const focusTimeGained = Number((weeklyHoursReclaimed * FOCUS_CONVERSION_RATE).toFixed(1));

  const onTrackPercentage = totalStartDailyHours > 0
    ? Math.round((dailyHoursReclaimedPerDay / totalStartDailyHours) * 100)
    : 0;

  const yearlyHoursReclaimed = calcYearlyProjection(weeklyHoursReclaimed);
  const yearlyMoneySaved = Math.round(moneySaved * (365 / Math.max(1, user.streakDays)));

  // ── 7-day rolling graph data ───────────────────────────────────────────────
  // Reads from the daily snapshot store — updates instantly when habits change
  const graphData = getLast7DaysGraphData(habits);
  const dayLabels        = graphData.map(d => d.day);
  const hoursLostData    = graphData.map(d => d.lost);
  const hoursReclaimedData = graphData.map(d => d.reclaimed);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUpdateHours = (id: string, newHours: number) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h;

        const trend : Habit['trend'] =
        newHours < h.startHours ? 'improving'
          : newHours > h.startHours ? 'worsening'
          : 'stable';

        const updatedWeekly = [...h.weeklyData];
        updatedWeekly[updatedWeekly.length - 1] = newHours * 7;

        const existingLog = h.log || [];
        const todayEntry = existingLog.find(l => l.date === today);
        const updatedLog = todayEntry
          ? existingLog.map(l => l.date === today ? { ...l, hours: newHours } : l)
          : [...existingLog, { date: today, hours: newHours }];

        return { ...h, dailyHours: newHours, trend, weeklyData: updatedWeekly, log: updatedLog };
      });

      // Snapshot the updated habits so graph updates instantly
      upsertTodaySnapshot(updated);
      return updated;
    });

    if (newHours < 1.0) {
      setMilestones(prev =>
        prev.map(m => m.id === 'ms-4' ? { ...m, earned: true, progress: 1 } : m)
      );
    }
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleAddHabit = (newHabitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const handleUpdateUser = (updatedUser: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const handleResetData = () => {
    setUser(SEED_USER);
    setHabits(SEED_HABITS);
    setMilestones(SEED_MILESTONES);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SNAPSHOT_KEY);  // clear graph history too
    setModalMode(null);
  };

  const handleOnboardingComplete = (data: {
    primaryHabitName: string;
    primaryHabitHours: number;
    wishForTime: string;
    drainingHabit: string;
    fiveHoursChange: string;
  }) => {
    const customHabits: Habit[] = [
      {
        id: 'habit-custom-1',
        name: data.primaryHabitName,
        icon: 'Smartphone',
        dailyHours: Math.max(0.5, data.primaryHabitHours - 0.4),
        startHours: data.primaryHabitHours,
        dailyCost: 0,
        trend: 'improving',
        weeklyData: Array(6).fill(Number((data.primaryHabitHours * 7).toFixed(1))),
        subCopy: 'Down from your initial baseline'
      },
      ...SEED_HABITS.slice(1)
    ];

    // Seed today's snapshot immediately after onboarding
    upsertTodaySnapshot(customHabits);
    setHabits(customHabits);
    setIsOnboarding(false);
  };

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % ROTATING_QUOTES.length);
  };

  // ── Onboarding screen ──────────────────────────────────────────────────────
  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between">
        <header className="py-6 px-8 border-b border-app-border/40 flex justify-between items-center">
          <span className="font-serif text-lg tracking-wide text-app-text">
            the <span className="text-app-green italic">real</span> cost
          </span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-app-muted">
            Self-Awareness Companion
          </span>
        </header>
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={() => setIsOnboarding(false)}
        />
        <footer className="py-4 text-center text-[10px] text-app-muted border-t border-app-border/20">
          Psychologically safe • No optimization pressure
        </footer>
      </div>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col justify-between selection:bg-app-green/20 selection:text-app-green">

      {/* Environment banner */}
      <div className="bg-app-surface border-b border-app-border py-2 px-6 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-app-green"></span>
            <span className="text-app-muted font-light">
              Mode: <strong className="text-app-text font-normal">
                {isDemoRoute ? 'Seeded Demo (/demo)' : 'Live Dashboard'}
              </strong>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setIsOnboarding(true)}
              className="text-app-muted hover:text-app-text premium-transition underline decoration-app-border hover:decoration-app-muted"
            >
              Re-run Onboarding
            </button>
            <span className="text-app-border">•</span>
            <button
              onClick={() => {
                setUser(SEED_USER);
                setHabits(SEED_HABITS);
                setMilestones(SEED_MILESTONES);
              }}
              className="text-app-muted hover:text-app-text premium-transition underline decoration-app-border hover:decoration-app-muted"
            >
              Load Demo Dataset
            </button>
            <span className="text-app-border">•</span>
            <button
              onClick={() => setModalMode('settings')}
              className="text-app-green hover:text-app-green/80 premium-transition font-medium"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <Navbar
        streakDays={user.streakDays}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={() => setModalMode('settings')}
      />

      <main className="max-w-6xl mx-auto px-6 py-4 flex-grow w-full">

        {/* TAB 1: TODAY */}
        {activeTab === 'today' && (
          <div className="space-y-12 animate-fade-in">
            <HeroSection
              weekRange={user.weekStart}
              hoursReclaimed={weeklyHoursReclaimed}
              moneySaved={moneySaved}
              focusTimeGained={focusTimeGained}
              onTrackPercentage={onTrackPercentage}
              currency={user.currency}
              supportingQuote={ROTATING_QUOTES[quoteIndex]}
            />
            <div className="text-right -mt-8 mb-4">
              <button
                onClick={cycleQuote}
                className="text-[10px] text-app-muted hover:text-app-text premium-transition italic"
              >
                ✨ Notice another reflection
              </button>
            </div>
            <DailyReflection
              reflectionSentence={
                weeklyHoursReclaimed > 5
                  ? `You reclaimed ${weeklyHoursReclaimed} hours this week. Small changes are beginning to compound.`
                  : 'This week contained your lowest distraction time yet.'
              }
              supportingInsight="Grounded entirely in your logged behavioral patterns."
            />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.08em] text-app-muted font-medium">
                  Active Patterns
                </span>
                <button
                  onClick={() => setActiveTab('habits')}
                  className="text-xs text-app-green hover:underline"
                >
                  View All & Edit →
                </button>
              </div>
              <HabitCards
                habits={habits.slice(0, 2)}
                hourlyValue={user.hourlyValue}
                currency={user.currency}
                onUpdateHours={handleUpdateHours}
                onDeleteHabit={handleDeleteHabit}
              />
            </div>
          </div>
        )}

        {/* TAB 2: HABITS */}
        {activeTab === 'habits' && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="premium-card p-6 bg-app-surface/50">
              <h2 className="text-sm font-medium text-app-text mb-1">
                Intentional Time Allocation
              </h2>
              <p className="text-xs text-app-muted font-light leading-relaxed max-w-2xl">
                Below are the active habits you are currently tracking. Adjust their daily hours
                as you notice yourself spending less time on them. Reclaiming even 15 minutes a
                day compounds into full days of freedom over the year.
              </p>
            </div>
            <HabitCards
              habits={habits}
              hourlyValue={user.hourlyValue}
              currency={user.currency}
              onUpdateHours={handleUpdateHours}
              onDeleteHabit={handleDeleteHabit}
              onAddHabit={() => setModalMode('add-habit')}
            />
            {habits.length === 0 && (
              <div className="text-center py-16 space-y-4 border border-app-border/40 rounded-xl">
                <p className="font-serif italic text-app-muted text-lg">
                  "Awareness begins with noticing patterns."
                </p>
                <p className="text-xs text-app-muted max-w-md mx-auto font-light">
                  Add your first habit to begin understanding where your time quietly goes.
                </p>
                <button
                  onClick={() => setModalMode('add-habit')}
                  className="px-4 py-2 bg-app-green text-app-bg rounded-lg text-xs font-medium uppercase tracking-wider"
                >
                  Add First Habit
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROGRESS */}
        {activeTab === 'progress' && (
          <div className="space-y-12 animate-fade-in py-4">
            <JourneyGraph
              weeks={dayLabels}
              hoursLostData={hoursLostData}
              hoursReclaimedData={hoursReclaimedData}
            />
            <MilestonesPanel
              milestones={milestones}
              currency={user.currency}
            />
            <FutureImpactPanel
              yearlyHoursReclaimed={yearlyHoursReclaimed}
              yearlyMoneySaved={yearlyMoneySaved}
              currency={user.currency}
            />
          </div>
        )}

        {/* TAB 4: INSIGHTS */}
        {activeTab === 'insights' && (
          <InsightsTab
            user={user}
            habits={habits}
            onUpdateAge={(newAge) => handleUpdateUser({ age: newAge })}
          />
        )}

      </main>

      {modalMode && (
        <ConfigureModal
          mode={modalMode}
          user={user}
          onClose={() => setModalMode(null)}
          onAddHabit={handleAddHabit}
          onUpdateUser={handleUpdateUser}
          onResetData={handleResetData}
        />
      )}

      <footer className="border-t border-app-border mt-12 bg-app-bg/50 py-8 text-xs text-app-muted">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-light">
          <div>
            <span className="font-serif text-app-text font-normal">the real cost</span>
            <span className="mx-2 text-app-border">•</span>
            <span>A calm behavioral self-awareness companion</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>No Leaderboards</span>
            <span>•</span>
            <span>No Guilt</span>
            <span>•</span>
            <span>Self-Comparison Only</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
