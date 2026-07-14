import { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';

interface NavbarProps {
  streakDays: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  streakDays, 
  activeTab, 
  setActiveTab,
  onResetData 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'today', label: 'Today' },
    { id: 'habits', label: 'Habits' },
    { id: 'progress', label: 'Progress' },
    { id: 'insights', label: 'Insights' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-app-border bg-app-bg/95 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('today')}
          className="text-left focus:outline-none group"
        >
          <span className="font-serif text-xl tracking-wide text-app-text font-normal">
            the <span className="text-app-green italic">real</span> cost
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button 
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-[11px] uppercase tracking-[0.08em] premium-transition pb-1 border-b ${
                  isActive 
                    ? 'text-app-text border-app-green font-medium' 
                    : 'text-app-muted border-transparent hover:text-app-text'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls: Streak Pill & Menu Toggle */}
        <div className="flex items-center space-x-4">
          
          {/* Streak Pill */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-app-green/10 border border-app-green/20">
            <Flame className="w-3.5 h-3.5 text-app-green animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.08em] text-app-green font-medium">
              {streakDays} days
            </span>
          </div>

          {/* Reset / Setup triggers if needed */}
          {onResetData && (
            <button
              onClick={onResetData}
              title="Reset or configure settings"
              className="hidden sm:block text-[10px] uppercase tracking-[0.08em] text-app-muted hover:text-app-text premium-transition px-2 py-1 rounded border border-app-border"
            >
              Configure
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-app-muted hover:text-app-text focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-app-bg border-b border-app-border px-6 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left text-[11px] uppercase tracking-[0.08em] py-2 ${
                  isActive ? 'text-app-green font-medium' : 'text-app-muted'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {onResetData && (
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-[11px] uppercase tracking-[0.08em] text-app-muted py-2 border-t border-app-border/50 mt-2"
            >
              Configure / Reset Data
            </button>
          )}
        </div>
      )}
    </header>
  );
};
