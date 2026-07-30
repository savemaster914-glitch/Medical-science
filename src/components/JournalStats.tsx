import React from 'react';
import { 
  FileText, 
  Globe, 
  Users, 
  UserCheck, 
  Clock, 
  Download, 
  Eye 
} from 'lucide-react';

export const JournalStats: React.FC = () => {
  const stats = [
    { label: "Published Articles", value: "1,200+", icon: FileText, desc: "Peer-reviewed biomedical studies" },
    { label: "Countries Represented", value: "75+", icon: Globe, desc: "Global author & reader network" },
    { label: "Peer Reviewers", value: "650+", icon: UserCheck, desc: "International expert panel" },
    { label: "Editorial Members", value: "180+", icon: Users, desc: "Distinguished academic scholars" },
    { label: "Avg. First Decision", value: "14 Days", icon: Clock, desc: "Rapid rigorous editorial workflow" },
    { label: "Article Downloads", value: "250,000+", icon: Download, desc: "Full-text PDF accesses" },
    { label: "Monthly Readers", value: "50,000+", icon: Eye, desc: "Active global readership" }
  ];

  return (
    <section className="py-8 bg-[#081F45] text-white relative overflow-hidden border-y border-[#184A87] font-sans">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081F45] via-[#184A87]/40 to-[#081F45] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold text-[#C79A3D] uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-xs border border-[#C79A3D]/40">
            Impact & Reach
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-white mt-1.5">
            Journal Statistics & Scientific Impact
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Measuring our contribution to biomedical literature from Al-Habbobi Teaching Hospital, Iraq.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-xs border border-white/10 p-2.5 rounded-sm text-center hover:border-[#C79A3D]/60 transition-all hover:bg-white/10 group"
              >
                <div className="w-7 h-7 rounded-full bg-[#C79A3D]/20 text-[#C79A3D] flex items-center justify-center mx-auto mb-1.5 group-hover:scale-105 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg sm:text-xl font-extrabold font-playfair text-[#C79A3D] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-white mt-0.5 leading-tight uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 font-normal leading-tight">
                  {stat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
