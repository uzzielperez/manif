import React from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/uiStore';
import { COSMIC_THEMES, CosmicThemeId } from '../styles/themes/cosmic';
import { Check } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { cosmicTheme, setCosmicTheme } = useUIStore();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white/90">Cosmic Interface</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(COSMIC_THEMES) as CosmicThemeId[]).map((themeId) => {
          const theme = COSMIC_THEMES[themeId];
          const isSelected = cosmicTheme === themeId;

          return (
            <motion.button
              key={themeId}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCosmicTheme(themeId)}
              className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
                isSelected 
                  ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'border-white/10 hover:border-white/30'
              }`}
              style={{
                background: theme.colors.glass,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex flex-col items-start gap-2 relative z-10">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-white">{theme.name}</span>
                  {isSelected && (
                    <div className="bg-white rounded-full p-0.5">
                      <Check size={12} className="text-black" />
                    </div>
                  )}
                </div>
                
                {/* Color preview swatches */}
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>

              {/* Background preview effect */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${theme.colors.primary} 0%, transparent 100%)`,
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

