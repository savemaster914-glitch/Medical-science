import React from 'react';
import { INDEXING_SERVICES } from '../data/mockJournalData';
import { Globe2, CheckCircle, Search, Award } from 'lucide-react';

export const IndexingSection: React.FC = () => {
  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
            Global Discoverability
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
            Indexing, Abstracting & Digital Preservation
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            IMJB is indexed and harvested across leading global scientific databases and digital archiving repositories.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {INDEXING_SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="bg-[#F6F7F9] border-l-2 border-l-[#C79A3D] border-t border-r border-b border-slate-200 hover:border-l-[#081F45] p-2.5 rounded-sm flex flex-col justify-between text-center transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="h-8 flex items-center justify-center">
                <span className="font-playfair font-bold text-xs text-[#081F45] group-hover:text-[#184A87] transition-colors leading-tight">
                  {service.logoText}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">{service.category}</div>
                <div className="text-[9px] font-bold text-emerald-700 flex items-center justify-center gap-0.5 mt-0.5">
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>{service.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
