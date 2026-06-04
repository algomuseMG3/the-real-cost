/**
 * InsightsTab.tsx
 *
 * The deepest tab — shows philosophical and mathematical
 * impact of habits on the user's life and potential.
 *
 * Props from App.tsx:
 * - user         → age and hourlyValue for calculations
 * - habits       → array to sum total daily hours
 * - onUpdateAge  → lets user drag age slider, updates App.tsx state
 *
 * My functions used here:
 * - calcLifePercent()     → habit hours as % of remaining waking life
 * - calcOpportunityCost() → reclaimed hours × hourly value = money equivalent
 *
 * Key things I learned:
 * - Two useState hooks here: one from App.tsx (user.age via prop)
 *   one local (lifeExpectancy) — local state stays inside this component
 * - range input slider directly calls onUpdateAge on every drag
 *   this updates App.tsx state → recalculates → updates live
 * - savedLifePercent shows improvement since tracking started
 *   only shows if > 0 (conditional rendering with &&)
 * - No external comparison anywhere — only self vs past self
 *   this is a product decision coded into the UI copy
 *
 * What I want to improve later:
 * - Add a "courses completable" metric using calcCoursesCompletable()
 * - Add a real daily log view showing actual hours per day
 */
import { useState } from 'react';
import { UserState, Habit } from '../data/seedData';
import { calcLifePercent, calcOpportunityCost } from '../utils/calculations';
import { AnimatedCounter } from './AnimatedCounter';

interface InsightsTabProps {
  user: UserState;
  habits: Habit[];
  onUpdateAge: (newAge: number) => void;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({
  user,
  habits,
  onUpdateAge
}) => {
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80);

  // Sum total daily hours across all habits
  const totalDailyHours = habits.reduce((sum, h) => sum + h.dailyHours, 0);
  const totalStartHours = habits.reduce((sum, h) => sum + h.startHours, 0);
  const totalHoursReclaimedPerWeek = Math.max(0, (totalStartHours - totalDailyHours) * 7);

  // Calculate percentages
  const currentLifePercent = calcLifePercent(totalDailyHours, user.age, lifeExpectancy);
  const startLifePercent = calcLifePercent(totalStartHours, user.age, lifeExpectancy);
  const savedLifePercent = Math.max(0, Number((startLifePercent - currentLifePercent).toFixed(1)));

  // Calculate Opportunity Cost of Reclaimed Time over the year
  const yearlyReclaimedHours = Math.round(totalHoursReclaimedPerWeek * 52);
  const opportunityCostValue = calcOpportunityCost(yearlyReclaimedHours, user.hourlyValue);

  return (
    <div className="space-y-12 py-6 animate-fade-in">
      
      {/* Intro Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-2 font-medium">
          Deep Noticing
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-app-text font-normal tracking-tight">
          The Hidden Cost of Daily Patterns
        </h1>
        <p className="text-xs md:text-sm text-app-muted mt-2 font-light max-w-2xl leading-relaxed">
          Awareness begins with noticing patterns. These insights translate small daily habits into their broader footprints across your remaining waking years and creative potential.
        </p>
      </div>

      {/* Waking Life Percentage Component */}
      <div className="premium-card p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.08em] text-app-green block mb-2 font-medium">
              Waking Life Footprint
            </span>
            <h2 className="text-lg md:text-xl font-light text-app-text">
              Your habits currently represent <span className="text-app-green font-medium">{currentLifePercent}%</span> of your waking life.
            </h2>
            <p className="text-xs text-app-muted mt-2 font-light leading-relaxed">
              Assuming 16 waking hours per day, spending <span className="text-app-text font-normal">{totalDailyHours.toFixed(1)} hours</span> each day on passive streams quietly claims this portion of your remaining waking years.
            </p>
            {savedLifePercent > 0 && (
              <p className="text-xs text-app-green mt-2 font-light">
                ✓ You have already reclaimed <span className="font-medium">{savedLifePercent}%</span> of your waking life back from when you began tracking.
              </p>
            )}
          </div>

          {/* Age & Life Expectancy controls */}
          <div className="bg-app-surface p-4 rounded-xl border border-app-border shrink-0 w-full md:w-64 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-app-muted mb-1">
                <span>Your Age</span>
                <span className="text-app-text font-light">{user.age} yrs</span>
              </div>
              <input
                type="range"
                min="16"
                max="100"
                value={user.age}
                onChange={(e) => onUpdateAge(Number(e.target.value))}
                className="w-full accent-app-green cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-app-muted mb-1">
                <span>Life Horizon</span>
                <span className="text-app-text font-light">{lifeExpectancy} yrs</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full accent-app-green cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Visual representation bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[10px] text-app-muted uppercase tracking-wider">
            <span>Waking hours devoted to these patterns</span>
            <span>{currentLifePercent}%</span>
          </div>
          <div className="w-full h-3 bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-app-border">
            <div 
              className="h-full bg-app-green rounded-full premium-transition"
              style={{ width: `${currentLifePercent}%` }}
            />
          </div>
          <div className="text-[10px] text-app-muted text-right font-light">
            {savedLifePercent > 0 ? `Down from ${startLifePercent}% initially` : 'Baseline self-awareness'}
          </div>
        </div>

      </div>

      {/* Opportunity Cost Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="premium-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-2 font-medium">
              What you could have done
            </span>
            <h3 className="text-lg font-light text-app-text mb-3">
              The Creative Opportunity
            </h3>
            <p className="text-xs text-app-muted font-light leading-relaxed">
              By reclaiming <span className="text-app-text font-normal">{yearlyReclaimedHours} hours</span> this year, you redirect deep intention back toward your aspirations. At your personal valuation of <span className="text-app-text font-normal">{user.currency}{user.hourlyValue}/hr</span>, this time preserves significant intangible value.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-app-border/40">
            <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-1">
              Annual Opportunity Value
            </div>
            <div className="text-3xl font-light text-app-green">
              <AnimatedCounter value={opportunityCostValue} prefix={user.currency} />
            </div>
            <div className="text-[10px] text-app-muted mt-1 font-light">
              Time for deeper focused work and personal peace.
            </div>
          </div>
        </div>

        <div className="premium-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-2 font-medium">
              Self-Comparison Over Time
            </span>
            <h3 className="text-lg font-light text-app-text mb-3">
              Honoring Your Own Rhythm
            </h3>
            <p className="text-xs text-app-muted font-light leading-relaxed">
              This space never compares your habits against external leaderboards or top percentiles. Your only baseline is your own past patterns. You are quietly proving that small daily choices gather into profound shifts over months and years.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-app-border/40">
            <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-1">
              Current Trajectory
            </div>
            <div className="text-base font-light text-app-text">
              {totalHoursReclaimedPerWeek > 0 
                ? `Reclaiming ~${totalHoursReclaimedPerWeek.toFixed(1)} hours every week.`
                : 'Observing your baseline to notice patterns.'}
            </div>
            <div className="text-[10px] text-app-green mt-1 font-light flex items-center">
              <span className="w-1 h-1 rounded-full bg-app-green inline-block mr-1.5"></span>
              Emotionally safe progress reinforcement
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
