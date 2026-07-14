import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: {
    primaryHabitName: string;
    primaryHabitHours: number;
    wishForTime: string;
    drainingHabit: string;
    fiveHoursChange: string;
  }) => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);

  // Form state
  const [primaryHabitName, setPrimaryHabitName] = useState('');
  const [primaryHabitHours, setPrimaryHabitHours] = useState<number>(2.0);
  const [wishForTime, setWishForTime] = useState('');
  const [drainingHabit, setDrainingHabit] = useState('');
  const [fiveHoursChange, setFiveHoursChange] = useState('');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        primaryHabitName: primaryHabitName.trim() || 'Late-night scrolling',
        primaryHabitHours: Number(primaryHabitHours) || 2.0,
        wishForTime: wishForTime.trim() || 'Reading and unhurried mornings',
        drainingHabit: drainingHabit.trim() || 'Passive digital browsing',
        fiveHoursChange: fiveHoursChange.trim() || 'More presence and unhurried mental space'
      });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Preset suggestions for rapid but calm input
  const habitSuggestions = [
    "Late-night scrolling",
    "Passive streaming",
    "Digital context switching",
    "Endless news checking"
  ];

  const wishSuggestions = [
    "Reading real books",
    "Unhurried mornings",
    "Deep uninterrupted work",
    "Quiet mental breathing room"
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-between py-12 px-6 max-w-3xl mx-auto animate-fade-in">
      
      {/* Top row: Progress indication & Skip */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1 rounded-full premium-transition ${
                s === step 
                  ? 'w-8 bg-app-green' 
                  : s < step 
                    ? 'w-4 bg-app-green/40' 
                    : 'w-4 bg-app-border'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={onSkip}
          className="text-xs text-app-muted hover:text-app-text premium-transition tracking-wider uppercase"
        >
          Skip to Dashboard
        </button>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-12">
        
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-[0.08em] text-app-muted block mb-3 font-light">
                Noticing without judgment
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-app-text font-normal leading-tight">
                What habit quietly takes most of your time?
              </h1>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={primaryHabitName}
                onChange={(e) => setPrimaryHabitName(e.target.value)}
                placeholder="e.g. Late-night scrolling"
                className="w-full bg-transparent border-b border-app-border focus:border-app-green pb-3 text-lg md:text-xl text-app-text placeholder:text-app-muted focus:outline-none premium-transition"
                autoFocus
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {habitSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrimaryHabitName(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border premium-transition ${
                      primaryHabitName === s 
                        ? 'bg-app-green/10 border-app-green text-app-green' 
                        : 'border-app-border text-app-muted hover:text-app-text'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Hours estimate */}
            <div className="pt-6 border-t border-app-border/40">
              <label className="text-xs text-app-muted block mb-2">
                Roughly how many hours per day does this habit consume?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.5"
                  value={primaryHabitHours}
                  onChange={(e) => setPrimaryHabitHours(Number(e.target.value))}
                  className="w-full accent-app-green cursor-pointer"
                />
                <span className="text-xl font-light text-app-green w-16 text-right shrink-0">
                  {primaryHabitHours.toFixed(1)} hrs
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-[0.08em] text-app-muted block mb-3 font-light">
                Reclaiming intention
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-app-text font-normal leading-tight">
                What do you wish you had more time for?
              </h1>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={wishForTime}
                onChange={(e) => setWishForTime(e.target.value)}
                placeholder="e.g. Reading real books, unhurried mornings"
                className="w-full bg-transparent border-b border-app-border focus:border-app-green pb-3 text-lg md:text-xl text-app-text placeholder:text-app-muted focus:outline-none premium-transition"
                autoFocus
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {wishSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setWishForTime(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border premium-transition ${
                      wishForTime === s 
                        ? 'bg-app-green/10 border-app-green text-app-green' 
                        : 'border-app-border text-app-muted hover:text-app-text'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-[0.08em] text-app-muted block mb-3 font-light">
                Emotional clarity
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-app-text font-normal leading-tight">
                Which habit feels emotionally draining?
              </h1>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={drainingHabit}
                onChange={(e) => setDrainingHabit(e.target.value)}
                placeholder="e.g. Passive digital browsing"
                className="w-full bg-transparent border-b border-app-border focus:border-app-green pb-3 text-lg md:text-xl text-app-text placeholder:text-app-muted focus:outline-none premium-transition"
                autoFocus
              />
              <p className="text-xs text-app-muted font-light">
                Noticing what drains your energy is the first step toward gently letting it go.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-xs uppercase tracking-[0.08em] text-app-muted block mb-3 font-light">
                Looking forward
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-app-text font-normal leading-tight">
                What would reclaiming 5 hours each week change for you?
              </h1>
            </div>

            <div className="space-y-4">
              <textarea
                value={fiveHoursChange}
                onChange={(e) => setFiveHoursChange(e.target.value)}
                placeholder="e.g. More presence, unhurried mental space, and deep focused work."
                rows={3}
                className="w-full bg-transparent border-b border-app-border focus:border-app-green pb-3 text-lg md:text-xl text-app-text placeholder:text-app-muted focus:outline-none premium-transition resize-none"
                autoFocus
              />
            </div>
          </div>
        )}

      </div>

      {/* Bottom row: Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-app-border">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="flex items-center space-x-2 text-xs uppercase tracking-wider text-app-muted hover:text-app-text premium-transition py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 text-xs uppercase tracking-wider text-app-bg bg-app-text hover:bg-app-green premium-transition px-6 py-3 rounded-full font-medium"
        >
          <span>{step === 4 ? 'Begin Dashboard' : 'Continue'}</span>
          {step === 4 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
};
