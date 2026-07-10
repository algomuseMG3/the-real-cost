/**
 * HabitCards.tsx
 *
 * Renders each habit as an interactive card.
 * User can increase/decrease daily hours using + / - buttons.
 *
 * Props received from App.tsx:
 * - habits        → array of habit objects
 * - hourlyValue   → user's estimated ₹ per hour
 * - currency      → ₹ or $
 * - onUpdateHours → calls App.tsx to update habit hours in state
 * - onDeleteHabit → calls App.tsx to remove habit from array
 * - onAddHabit    → opens ConfigureModal in add-habit mode
 *
 * My functions used here:
 * - calcTimeCost()       → opportunity cost if no direct spend
 * - calcYearlyProjection() → yearly hours from weekly hours
 *
 * Key things I learned:
 * - + / - buttons call onUpdateHours → App.tsx state updates
 *   → all derived metrics recalculate → UI re-renders live
 * - Progress bar uses ratio = dailyHours / startHours
 *   lower ratio = more improvement = greener bar
 * - renderIcon() is a helper function using switch statement
 *   maps icon name string to actual React component
 * - habit.dailyCost > 0 decides which cost formula to use
 *   direct spend OR opportunity cost — never both
 *
 * What I want to improve later:
 * - Add a daily check-in input so user logs actual hours each day
 * - Use those daily logs to build real weeklyData for the graph
 */
import React from 'react';
import { 
  Smartphone, 
  Tv, 
  Laptop, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Minus, 
  Trash2,
  PlusCircle
} from 'lucide-react';
import { Habit } from '../data/seedData';
import { calcTimeCost, calcYearlyProjection } from '../utils/calculations';

interface HabitCardsProps {
  habits: Habit[];
  hourlyValue: number;
  currency: string;
  onUpdateHours: (id: string, newHours: number) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit?: () => void;
}

export const HabitCards: React.FC<HabitCardsProps> = ({
  habits,
  hourlyValue,
  currency,
  onUpdateHours,
  onDeleteHabit,
  onAddHabit
}) => {

  // Helper to render the correct Lucide icon
  const renderIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 text-app-muted group-hover:text-app-text premium-transition" };
    switch (iconName) {
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      default: return <Clock {...props} />;
    }
  };

  return (
    <section className="py-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.08em] text-app-muted font-medium">
            Your habits
          </h2>
          <p className="text-xs text-app-text mt-1 font-light">
            Noticing where your hours quietly go.
          </p>
        </div>

        {onAddHabit && (
          <button
            onClick={onAddHabit}
            className="flex items-center space-x-1.5 text-xs text-app-green hover:text-app-green/80 premium-transition px-3 py-1.5 rounded-full bg-app-green/10 border border-app-green/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Habit</span>
          </button>
        )}
      </div>

      {/* Grid of Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          
          // Calculate yearly impact using pure functions
          // If the habit has direct dailyCost, use that for annual spend, otherwise value of time
          const yearlyTime = calcYearlyProjection(habit.dailyHours * 7);
          const yearlyMonetaryCost = habit.dailyCost > 0 
            ? Math.round(habit.dailyCost * 365)
            : calcTimeCost(habit.dailyHours, hourlyValue);

          // Calculate a simple percentage for the 2px subtle progress bar
          // For example, if startHours was 3.0 and current is 1.5, progress is 50%
          const ratio = habit.startHours > 0 ? (habit.dailyHours / habit.startHours) : 1;
          const fillPercent = Math.min(Math.max(ratio * 100, 5), 100);

          const isImproving = habit.trend === 'improving';

          return (
            <div key={habit.id} className="premium-card p-6 flex flex-col justify-between group">
              
              {/* Top Row: Icon, Name & Actions */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-app-surface border border-app-border">
                      {renderIcon(habit.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-app-text">
                        {habit.name}
                      </h3>
                      <p className="text-xs text-app-muted font-light mt-0.5">
                        {habit.subCopy}
                      </p>
                    </div>
                  </div>

                  {/* Inline adjustments triggers */}
                  <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 premium-transition">
                    <button
                      onClick={() => onUpdateHours(habit.id, Math.max(0, Number((habit.dailyHours - 0.1).toFixed(1))))}
                      className="p-1 text-app-muted hover:text-app-text rounded"
                      title="Decrease daily hours"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateHours(habit.id, Number((habit.dailyHours + 0.1).toFixed(1)))}
                      className="p-1 text-app-muted hover:text-app-text rounded"
                      title="Increase daily hours"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1 text-app-muted hover:text-app-coral rounded ml-1"
                      title="Remove habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Yearly Impact */}
                <div className="mt-4 pt-3 border-t border-app-border/40 flex items-center justify-between text-xs">
                  <span className="text-app-muted">Yearly projection:</span>
                  <span className="text-app-text font-light">
                    {yearlyTime} hours <span className="text-app-muted">({currency}{yearlyMonetaryCost.toLocaleString()})</span>
                  </span>
                </div>
              </div>

              {/* Bottom Section: Progress Bar & Current Daily Hours */}
              <div className="mt-6">
                
                {/* Metrics Row */}
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-xs text-app-muted">
                    Current daily hours
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-light text-app-text">
                      {habit.dailyHours.toFixed(1)}h
                    </span>
                    <span className="text-[10px] text-app-muted ml-1.5 block sm:inline">
                      (Started at {habit.startHours.toFixed(1)}h)
                    </span>
                  </div>
                </div>

                {/* 2px Subtle Progress Bar */}
                <div className="w-full h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className={`h-full premium-transition ${
                      isImproving ? 'bg-app-green' : 'bg-app-coral'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>

                {/* Small Trend Insight */}
                <div className="mt-2 text-[10px] text-app-muted flex items-center justify-between">
                  <span>{isImproving ? 'Gently decreasing over time' : 'Requires gentle awareness'}</span>
                  <span className={isImproving ? 'text-app-green' : 'text-app-coral'}>
                    {isImproving ? 'Improving' : 'Reviewing'}
                  </span>
                </div>
                {/* Daily Check-in */}
                
                     <div className="mt-3 pt-3 border-t border-app-border/30 flex items-center justify-between">
                          <span className="text-[10px] text-app-muted uppercase tracking-wider">
                             Log today
                               </span>
                                 <div className="flex items-center gap-2">
                                      <input
                                      type="number"
                                        min="0"
                                           max="24"
                                              step="0.5"
                                                defaultValue={habit.dailyHours}
                                                 onBlur={(e) => {
                                                     const val = Number(e.target.value);
                                                      if (!isNaN(val) && val >= 0 && val <= 24) {
                                                      onUpdateHours(habit.id, val);
                                                              }
                                                              }}
                                                                className="w-16 bg-app-surface border border-app-border rounded-lg px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-green premium-transition text-center"
                                                                        />
                                                                           <span className="text-[10px] text-app-muted">hrs</span>
                                                                                    </div>
                                                                                      </div> 

                                                                                      </div>

                                                                                         </div>
                                                                                         );
                                                                                                })}
                                                                                                 </div>

                                                                                                  </section>
  );
};
