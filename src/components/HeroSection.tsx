import React from 'react';
import { Send, BookOpen, Search, ShieldCheck, Award, Sparkles, ArrowRight, Dna } from 'lucide-react';
import { ActivePage } from '../types';

interface HeroSectionProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSubmitModal: () => void;
  onOpenSearchModal: () => void;
  onOpenTrackModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenSubmitModal,
  onOpenSearchModal,
  onOpenTrackModal
}) => {
  return (
    <section className="relative bg-[#081F45] text-white overflow-hidden border-b border-[#184A87] font-sans">
      {/* Background Decorative Mesh & Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#081F45] via-[#081F45]/95 to-[#184A87]/90 z-10"></div>
      
      <img
        src="/src/assets/images/journal_hero_banner_1785437383419.jpg"
        alt="Biomedical laboratory research background"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-overlay"
        referrerPolicy="no-referrer"
      />

      {/* Decorative Radial Backdrop */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C79A3D]/10 rounded-full blur-3xl pointer-events-none z-10"></div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-4 text-left">
          {/* Eyebrow Institutional Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#C79A3D]/40 px-3 py-1 rounded-sm text-[11px] font-bold text-[#C79A3D] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#C79A3D]" />
            <span>Al-Habbobi Teaching Hospital • Dhi Qar, Iraq</span>
            <span className="bg-[#C79A3D] text-[#081F45] px-1.5 py-0.5 rounded-xs text-[9px] font-black uppercase">Quarterly</span>
          </div>

          {/* Main Hero Serif Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-playfair tracking-tight text-white leading-snug">
            Advancing Biomedical Science Through <span className="text-[#C79A3D] italic">Excellence</span> in Medical Research
          </h1>

          {/* High Density Description */}
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed max-w-2xl">
            The Iraqi Journal of Biomedical and Clinical Medicine (IJBCM) is an international peer-reviewed open-access quarterly medical journal published by the Department of Medical Laboratories, Al-Habbobi Teaching Hospital, dedicated to publishing high-impact original research across biomedical sciences and clinical medicine.
          </p>

          {/* Key Metrics Quick Ribbon - Compact Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-lg">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm text-left">
              <div className="text-sm font-bold font-playfair text-[#C79A3D]">Quarterly</div>
              <div className="text-[10px] text-slate-300 font-medium">March • June • Sept • Dec</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm text-left">
              <div className="text-sm font-bold font-playfair text-white">Double-Blind</div>
              <div className="text-[10px] text-slate-300 font-medium">Peer Review Process</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-sm text-left">
              <div className="text-sm font-bold font-playfair text-[#C79A3D]">CC BY 4.0</div>
              <div className="text-[10px] text-slate-300 font-medium">Open Access Journal</div>
            </div>
          </div>


        </div>

        {/* Right Column Interactive Hub Card */}
        <div className="lg:col-span-5">
          <div className="rounded-sm bg-white/5 backdrop-blur-md border border-white/15 p-4 shadow-lg space-y-3">
            {/* Header badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-[#C79A3D] animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-xs font-bold font-playfair text-white tracking-wide">Biomedical Research Hub</span>
              </div>
              <span className="text-[10px] bg-[#C79A3D]/20 text-[#C79A3D] font-bold px-2 py-0.5 rounded-xs border border-[#C79A3D]/30 uppercase tracking-wider">
                IMJB-OJS 2026
              </span>
            </div>

            {/* Scientific Equipment Illustration Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#081F45]/90 border border-slate-700 p-2.5 rounded-sm space-y-1 hover:border-[#C79A3D] transition-colors">
                <div className="text-[#C79A3D] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Digital Microscope
                </div>
                <p className="text-slate-300 text-[10px]">Fluorescence 400x High-Res</p>
              </div>

              <div className="bg-[#081F45]/90 border border-slate-700 p-2.5 rounded-sm space-y-1 hover:border-[#C79A3D] transition-colors">
                <div className="text-[#C79A3D] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  DNA Helix & PCR
                </div>
                <p className="text-slate-300 text-[10px]">Real-time Multiplex Assays</p>
              </div>

              <div className="bg-[#081F45]/90 border border-slate-700 p-2.5 rounded-sm space-y-1 hover:border-[#C79A3D] transition-colors">
                <div className="text-[#C79A3D] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Clinical Chemistry
                </div>
                <p className="text-slate-300 text-[10px]">Automated Serum Analyzer</p>
              </div>

              <div className="bg-[#081F45]/90 border border-slate-700 p-2.5 rounded-sm space-y-1 hover:border-[#C79A3D] transition-colors">
                <div className="text-[#C79A3D] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Histopathology
                </div>
                <p className="text-slate-300 text-[10px]">WSI Digital Slide Biopsies</p>
              </div>
            </div>

            {/* Live Publication Status Card */}
            <div className="bg-gradient-to-r from-[#184A87] to-[#081F45] border border-[#C79A3D]/40 p-3 rounded-sm flex items-center justify-between text-left">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-[#C79A3D] font-bold">Call for Papers</div>
                <div className="text-xs font-bold text-white font-playfair">Volume 4, Issue 2 (June 2026)</div>
                <div className="text-[10px] text-slate-300 font-medium">Deadline: April 30, 2026</div>
              </div>
              <button
                onClick={onOpenSubmitModal}
                className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
