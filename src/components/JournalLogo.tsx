import React from 'react';

interface JournalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const JournalLogo: React.FC<JournalLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Emblem Logo */}
      <div className={`relative ${dimensions[size]} flex-shrink-0 flex items-center justify-center rounded-full bg-[#081F45] border-2 border-[#C79A3D] shadow-md p-1 group hover:border-amber-300 transition-colors`}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#C79A3D]" fill="currentColor">
          {/* Outer Ring with Wreath motif */}
          <circle cx="50" cy="50" r="47" fill="none" stroke="#C79A3D" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#184A87" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Laurel Wreath Left & Right */}
          <path d="M 18,50 C 18,30 30,18 50,15 C 38,22 26,34 26,50 C 26,66 38,78 50,85 C 30,82 18,70 18,50 Z" opacity="0.4" />
          <path d="M 82,50 C 82,30 70,18 50,15 C 62,22 74,34 74,50 C 74,66 62,78 50,85 C 70,82 82,70 82,50 Z" opacity="0.4" />
          
          {/* Microscope & DNA Helix Caduceus Icon */}
          <g transform="translate(25, 22) scale(0.5)">
            {/* DNA double helix strand */}
            <path d="M 20 10 C 40 30, 60 30, 80 10 C 60 40, 40 40, 20 70 C 40 90, 60 90, 80 70" fill="none" stroke="#C79A3D" strokeWidth="4" strokeLinecap="round" />
            <path d="M 80 10 C 60 30, 40 30, 20 10 C 40 40, 60 40, 80 70 C 60 90, 40 90, 20 70" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            {/* Base pairs */}
            <line x1="30" y1="20" x2="70" y2="20" stroke="#C79A3D" strokeWidth="3" />
            <line x1="40" y1="35" x2="60" y2="35" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="#C79A3D" strokeWidth="3" />
            <line x1="40" y1="75" x2="60" y2="75" stroke="#FFFFFF" strokeWidth="3" />

            {/* Central Microscope Lens */}
            <path d="M 45 40 L 55 40 L 60 70 L 40 70 Z" fill="#C79A3D" />
            <circle cx="50" cy="30" r="10" fill="#FFFFFF" />
            <rect x="35" y="72" width="30" height="6" rx="3" fill="#FFFFFF" />
          </g>

          {/* Iraqi Star / Mesopotamian Accent Dot */}
          <polygon points="50,10 52,14 56,15 53,18 54,22 50,20 46,22 47,18 44,15 48,14" fill="#C79A3D" />
        </svg>
      </div>

      {/* Text block */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-playfair font-bold text-[#081F45] tracking-tight leading-none text-base sm:text-lg">
              Iraqi Medical Journal for Biomedicine
            </span>
            <span className="bg-[#C79A3D]/20 text-[#081F45] text-xs font-semibold px-1.5 py-0.5 rounded border border-[#C79A3D]/40">
              IMJB
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">
            Published by Department of Medical Laboratories • Al-Habbobi Teaching Hospital
          </span>
        </div>
      )}
    </div>
  );
};
