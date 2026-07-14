import { Check } from 'lucide-react';
import { Milestone } from '../data/seedData';

interface MilestonesPanelProps {
  milestones: Milestone[];
  currency: string;
}

export const MilestonesPanel: React.FC<MilestonesPanelProps> = ({
  milestones,
  currency
}) => {
  return (
    <section className="py-8">
      
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.08em] text-app-muted font-medium">
          How you've grown
        </h2>
        <p className="text-xs text-app-text mt-1 font-light">
          Quiet evidence of your personal shifts.
        </p>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone) => {
          const isEarned = milestone.earned;

          // Format progress string
          let progressString = '';
          if (!isEarned) {
            if (milestone.unit === '₹') {
              progressString = `${currency}${milestone.progress.toLocaleString()} / ${currency}${milestone.target.toLocaleString()}`;
            } else {
              progressString = `${milestone.progress} / ${milestone.target} ${milestone.unit}`;
            }
          }

          return (
            <div 
              key={milestone.id}
              className={`p-5 rounded-xl border premium-transition flex flex-col justify-between ${
                isEarned 
                  ? 'bg-app-green/[0.04] border-app-green/20' 
                  : 'bg-white/[0.01] border-app-border/40 opacity-60'
              }`}
            >
              
              {/* Top Row: Name & Status Icon */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`text-sm font-medium ${isEarned ? 'text-app-text' : 'text-app-muted'}`}>
                    {milestone.name}
                  </h3>
                  
                  {isEarned ? (
                    <div className="w-5 h-5 rounded-full bg-app-green/20 flex items-center justify-center text-app-green shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-app-border flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-app-muted">🔒</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-app-muted font-light leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Bottom Row: Progress Hint */}
              <div className="mt-4 pt-3 border-t border-app-border/30 flex items-center justify-between text-[11px]">
                <span className="text-app-muted uppercase tracking-wider text-[9px]">
                  {isEarned ? 'Reflected' : 'In Progress'}
                </span>
                
                <span className={isEarned ? 'text-app-green font-light' : 'text-app-muted font-light'}>
                  {isEarned ? 'Acknowledged' : progressString}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
