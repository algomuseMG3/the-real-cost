import { AnimatedCounter } from './AnimatedCounter';

interface FutureImpactPanelProps {
  yearlyHoursReclaimed: number;
  yearlyMoneySaved: number;
  currency: string;
}

export const FutureImpactPanel: React.FC<FutureImpactPanelProps> = ({
  yearlyHoursReclaimed,
  yearlyMoneySaved,
  currency
}) => {
  return (
    <section className="py-8">
      
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.08em] text-app-muted font-medium">
          If you keep going
        </h2>
        <p className="text-xs text-app-text mt-1 font-light">
          One year from now
        </p>
      </div>

      {/* Surface grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Hours reclaimed
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-green flex items-baseline">
              <AnimatedCounter value={yearlyHoursReclaimed} />
              <span className="text-xs text-app-green/70 ml-1 font-normal">hrs</span>
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Returned directly to your control
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Money saved
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-light text-app-green flex items-baseline">
              <AnimatedCounter value={yearlyMoneySaved} prefix={currency} />
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Preserved through quiet intention
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Meaningful projects
          </div>
          <div>
            <div className="text-base md:text-lg font-light text-app-green leading-snug">
              Enough time for deeper focused work.
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Space to create and build
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="premium-card p-6 flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-muted mb-3">
            Mental clarity
          </div>
          <div>
            <div className="text-base md:text-lg font-light text-app-green leading-snug">
              More mental space.
            </div>
            <div className="text-xs text-app-muted mt-1.5 font-light">
              Reduced attention fragmentation
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
