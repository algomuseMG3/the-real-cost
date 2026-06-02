import { AnimatedCounter } from './AnimatedCounter';

interface HeroSectionProps {
  weekRange: string;
  hoursReclaimed: number;
  moneySaved: number;
  focusTimeGained: number; // in hours
  onTrackPercentage: number;
  currency: string;
  supportingQuote: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  weekRange,
  hoursReclaimed,
  moneySaved,
  focusTimeGained,
  onTrackPercentage,
  currency,
  supportingQuote
}) => {
  return (
    <section className="py-8 md:py-12">
      
      {/* Eyebrow */}
      <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3 font-medium">
        {weekRange}
      </div>

      {/* Headline */}
      <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-app-text font-normal tracking-tight leading-tight max-w-3xl mb-4">
        You reclaimed {hoursReclaimed} <span className="text-app-green italic font-serif">hours</span> this week.
      </h1>

      {/* Supporting text */}
      <p className="text-app-muted text-sm md:text-base max-w-2xl font-light leading-relaxed mb-10">
        {supportingQuote}
      </p>

      {/* 4 Calm Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Hours reclaimed */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Hours reclaimed
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-text flex items-baseline">
              <AnimatedCounter value={hoursReclaimed} decimals={1} />
              <span className="text-xs text-app-muted ml-1 font-normal">hrs</span>
            </div>
            <div className="text-xs text-app-green mt-1.5 font-light flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-app-green mr-1.5"></span>
              Gentle positive shift
            </div>
          </div>
        </div>

        {/* Metric 2: Money saved */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Money saved
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-text flex items-baseline">
              <AnimatedCounter value={moneySaved} prefix={currency} />
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Redirected toward core priorities
            </div>
          </div>
        </div>

        {/* Metric 3: Focus time gained */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Focus time gained
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-text flex items-baseline">
              <AnimatedCounter value={focusTimeGained} decimals={1} />
              <span className="text-xs text-app-muted ml-1 font-normal">hrs</span>
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Deep work & quiet noticing
            </div>
          </div>
        </div>

        {/* Metric 4: On track this month */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            On track this month
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-text flex items-baseline">
              <AnimatedCounter value={onTrackPercentage} suffix="%" />
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Self-comparison over time
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
