interface DailyReflectionProps {
  reflectionSentence: string;
  supportingInsight: string;
}

export const DailyReflection: React.FC<DailyReflectionProps> = ({
  reflectionSentence,
  supportingInsight
}) => {
  return (
    <section className="py-6">
      
      {/* Soft green-tinted card */}
      <div className="premium-card bg-app-green/[0.02] border-app-green/10 p-6 md:p-8 relative overflow-hidden">
        
        {/* Subtle decorative glow in the corner */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-app-green/[0.03] rounded-full blur-xl pointer-events-none" />

        <div className="max-w-3xl">
          
          {/* Eyebrow / Label */}
          <div className="text-[10px] uppercase tracking-[0.08em] text-app-green/60 mb-3 font-medium">
            Daily reflection
          </div>

          {/* Lora Italic Sentence */}
          <p className="font-serif italic text-lg md:text-xl text-app-text font-normal leading-relaxed">
            “{reflectionSentence}”
          </p>

          {/* Small supporting insight below */}
          <div className="mt-3 text-[10px] text-app-green/60 tracking-wide font-light">
            {supportingInsight}
          </div>

        </div>

      </div>

    </section>
  );
};
