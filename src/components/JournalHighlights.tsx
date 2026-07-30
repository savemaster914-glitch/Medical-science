import React from 'react';
import { 
  Unlock, 
  EyeOff, 
  FileCheck2, 
  CalendarClock, 
  Globe, 
  Zap, 
  TrendingUp, 
  Headphones 
} from 'lucide-react';

export const JournalHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Unlock,
      title: "Open Access",
      description: "All published articles are immediately accessible globally under Creative Commons CC BY 4.0 without paywalls or subscription barriers.",
      color: "from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200"
    },
    {
      icon: EyeOff,
      title: "Double-Blind Peer Review",
      description: "Independent double-blind peer review by at least two expert referees ensures complete impartiality and highest scientific integrity.",
      color: "from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200"
    },
    {
      icon: FileCheck2,
      title: "CrossRef DOI Registration",
      description: "Every accepted article is assigned a persistent CrossRef Digital Object Identifier (DOI: 10.58920/imjb) for permanent citation indexing.",
      color: "from-indigo-500/10 to-indigo-500/5 text-indigo-700 border-indigo-200"
    },
    {
      icon: CalendarClock,
      title: "Quarterly Publication",
      description: "Four regular issues released annually in March, June, September, and December, maintaining predictable publishing schedules.",
      color: "from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200"
    },
    {
      icon: Globe,
      title: "International Editorial Board",
      description: "Guided by distinguished medical laboratory scientists, pathologists, and clinicians from Iraq, UK, USA, Germany, Egypt, and Japan.",
      color: "from-purple-500/10 to-purple-500/5 text-purple-700 border-purple-200"
    },
    {
      icon: Zap,
      title: "Rapid Editorial Decision",
      description: "Average first editorial decision delivered within 14 days of submission, accelerating time-to-publication for critical medical findings.",
      color: "from-rose-500/10 to-rose-500/5 text-rose-700 border-rose-200"
    },
    {
      icon: TrendingUp,
      title: "Global Visibility",
      description: "Indexed across Google Scholar, DOAJ, Dimensions, ROAD, and OpenAlex, ensuring maximum global readership and academic citations.",
      color: "from-cyan-500/10 to-cyan-500/5 text-cyan-700 border-cyan-200"
    },
    {
      icon: Headphones,
      title: "Dedicated Author Support",
      description: "Comprehensive guidance for authors throughout submission, initial plagiarism checks, proofreading, and post-publication promotion.",
      color: "from-teal-500/10 to-teal-500/5 text-teal-700 border-teal-200"
    }
  ];

  return (
    <section className="py-8 bg-[#F6F7F9] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold text-[#C79A3D] uppercase tracking-widest bg-white border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
            Excellence & Standards
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45] mt-1.5">
            Journal Highlights & Core Specifications
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Why authors and medical researchers trust IMJB for open-access biomedical publishing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {highlights.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-sm border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 p-4 shadow-xs hover:border-l-[#081F45] hover:shadow-sm transition-all duration-200 group text-left"
              >
                <div className={`w-8 h-8 rounded-xs bg-gradient-to-br ${card.color} border flex items-center justify-center mb-2.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#081F45] font-playfair mb-1 group-hover:text-[#184A87] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-normal font-sans">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
