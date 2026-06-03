/**
 * ConfigureModal Component
 * 
 * A popup form that works in two modes:
 * 1. 'add-habit' → collects habit name, hours, cost
 * 2. 'settings'  → collects user name, hourly value, currency
 * 
 * Key React concepts used here:
 * - useState: remembers each input field's value
 * - Props with callbacks: data flows UP to App.tsx via onAddHabit()
 * - Conditional rendering: mode decides which form to show
 * - Ternary operator: auto-calculates if habit is improving/worsening
 * 
 * My learning note: the modal doesn't save data itself.
 * It packages the form inputs and sends them to the parent.
 * This pattern is called "lifting state up" in React.
 * 
 * What I want to change later: weeklyData is currently fake.
 * I will replace it with real daily log data from localStorage.
 */
import { useState } from 'react';
import { X, Smartphone, Tv, Laptop, ShoppingBag, Clock } from 'lucide-react';
import { Habit, UserState } from '../data/seedData';

interface ConfigureModalProps {
  mode: 'add-habit' | 'settings';
  user: UserState;
  onClose: () => void;
  onAddHabit?: (habit: Omit<Habit, 'id'>) => void;
  onUpdateUser?: (updatedUser: Partial<UserState>) => void;
  onResetData?: () => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({
  mode,
  user,
  onClose,
  onAddHabit,
  onUpdateUser,
  onResetData
}) => {
  // Add Habit State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Smartphone');
  const [dailyHours, setDailyHours] = useState<number>(1.0);
  const [startHours, setStartHours] = useState<number>(1.5);
  const [dailyCost, setDailyCost] = useState<number>(0);
  const [subCopy, setSubCopy] = useState('');

  // Settings State
  const [userName, setUserName] = useState(user.name);
  const [hourlyValue, setHourlyValue] = useState<number>(user.hourlyValue);
  const [currency, setCurrency] = useState(user.currency);

  const handleAddHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !onAddHabit) return;

    onAddHabit({
      name: name.trim(),
      icon,
      dailyHours: Number(dailyHours),
      startHours: Number(startHours),
      dailyCost: Number(dailyCost),
      trend: dailyHours < startHours ? 'improving' : dailyHours > startHours ? 'worsening' : 'stable',
      weeklyData: [startHours * 7, startHours * 6.5, startHours * 6, startHours * 5.5, startHours * 5, dailyHours * 7],
      subCopy: subCopy.trim() || 'Noticing new patterns'
    });
    onClose();
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser) return;

    onUpdateUser({
      name: userName.trim() || 'Monika',
      hourlyValue: Number(hourlyValue) || 500,
      currency
    });
    onClose();
  };

  const iconsList = [
    { name: 'Smartphone', label: 'Phone', component: Smartphone },
    { name: 'Tv', label: 'Screen', component: Tv },
    { name: 'Laptop', label: 'Work', component: Laptop },
    { name: 'ShoppingBag', label: 'Shopping', component: ShoppingBag },
    { name: 'Clock', label: 'General', component: Clock },
  ];

  const currenciesList = ['₹', '$', '€', '£'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-bg/80 backdrop-blur-sm animate-fade-in">
      <div className="premium-card bg-app-bg max-w-md w-full p-6 md:p-8 relative border-app-border">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-text premium-transition p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {mode === 'add-habit' ? (
          <form onSubmit={handleAddHabitSubmit} className="space-y-5">
            <div>
              <h2 className="text-lg font-medium text-app-text">Add a Habit</h2>
              <p className="text-xs text-app-muted mt-1 font-light">
                Track where your hours go to reclaim them intentionally.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Passive news reading"
                required
                className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-green premium-transition"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Icon
              </label>
              <div className="flex items-center space-x-2">
                {iconsList.map((item) => {
                  const IconComp = item.component;
                  const isSelected = icon === item.name;
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => setIcon(item.name)}
                      className={`p-2.5 rounded-lg border premium-transition flex flex-col items-center space-y-1 ${
                        isSelected 
                          ? 'bg-app-green/10 border-app-green text-app-green' 
                          : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
                      }`}
                      title={item.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                  Current Daily Hours
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="24"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  required
                  className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-green premium-transition"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                  Started At (Hours)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="24"
                  value={startHours}
                  onChange={(e) => setStartHours(Number(e.target.value))}
                  required
                  className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-green premium-transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Direct Financial Cost / Day ({user.currency})
              </label>
              <input
                type="number"
                min="0"
                value={dailyCost}
                onChange={(e) => setDailyCost(Number(e.target.value))}
                placeholder="Optional snack/subscription cost"
                className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-green premium-transition"
              />
              <span className="text-[9px] text-app-muted block mt-1">
                Leave at 0 if the cost is purely time and future potential.
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Short Reflection
              </label>
              <input
                type="text"
                value={subCopy}
                onChange={(e) => setSubCopy(e.target.value)}
                placeholder="e.g. Slowly creating dedicated space"
                className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-green premium-transition"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-app-text text-app-bg hover:bg-app-green premium-transition py-2 rounded-lg text-xs uppercase tracking-wider font-medium"
              >
                Save Habit
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSettingsSubmit} className="space-y-5">
            <div>
              <h2 className="text-lg font-medium text-app-text">Configuration</h2>
              <p className="text-xs text-app-muted mt-1 font-light">
                Tailor your value calculations and preferences.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-green premium-transition"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Estimated Value of Time / Hour
              </label>
              <input
                type="number"
                min="0"
                value={hourlyValue}
                onChange={(e) => setHourlyValue(Number(e.target.value))}
                required
                className="w-full bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text focus:outline-none focus:border-app-green premium-transition"
              />
              <span className="text-[9px] text-app-muted block mt-1">
                Used to reveal the monetary equivalent of your lost hours.
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.08em] text-app-muted block mb-1.5">
                Currency Symbol
              </label>
              <div className="flex items-center space-x-3">
                {currenciesList.map((curr) => (
                  <button
                    type="button"
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`w-10 h-10 rounded-lg border premium-transition flex items-center justify-center text-sm ${
                      currency === curr 
                        ? 'bg-app-green/10 border-app-green text-app-green' 
                        : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                type="submit"
                className="w-full bg-app-text text-app-bg hover:bg-app-green premium-transition py-2 rounded-lg text-xs uppercase tracking-wider font-medium"
              >
                Save Settings
              </button>

              {onResetData && (
                <button
                  type="button"
                  onClick={onResetData}
                  className="w-full bg-transparent text-app-coral hover:bg-app-coral/10 border border-app-coral/30 premium-transition py-2 rounded-lg text-xs uppercase tracking-wider font-light"
                >
                  Reset Dashboard Data
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
