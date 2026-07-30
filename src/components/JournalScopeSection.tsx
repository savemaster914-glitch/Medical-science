import React from 'react';
import { SCOPE_CATEGORIES } from '../data/mockJournalData';
import { Stethoscope, FlaskConical, Microscope, Dna, Bug, ShieldCheck, Activity, Binary, Droplet, Biohazard, Flame, Cpu, Target, Sparkles, Globe, Layers } from 'lucide-react';

interface JournalScopeSectionProps {
  onNavigateToArticles: () => void;
}

export const JournalScopeSection: React.FC<JournalScopeSectionProps> = ({ onNavigateToArticles }) => {
  const fullScopesList = [
    "Clinical Medicine", "Internal Medicine", "Pathology", "Histopathology", 
    "Medical Laboratory Science", "Clinical Chemistry", "Medical Microbiology", 
    "Immunology", "Cancer Biology", "Molecular Diagnostics", "PCR Assays", 
    "ELISA Protocols", "Flow Cytometry", "Hematology", "Blood Banking", 
    "Parasitology", "Virology", "Mycology", "Medical Genetics", "Biochemistry", 
    "Endocrinology", "Nephrology", "Cardiology", "Neurology", "Radiology", 
    "Artificial Intelligence in Medicine", "Precision Medicine", "Stem Cell Research", 
    "Nanomedicine", "Biomarkers", "Translational Medicine", "Public Health", "Medical Education"
  ];

  return (
    <section className="py-8 bg-[#F6F7F9] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
          Biomedical Coverage
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
          Journal Aim & Scope
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 max-w-3xl mx-auto">
          The Iraqi Medical Journal for Biomedicine publishes high-quality research across all basic and clinical biomedical disciplines, laboratory medicine, and health technologies.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6 text-left">
          {SCOPE_CATEGORIES.map((scope, idx) => (
            <div
              key={idx}
              onClick={onNavigateToArticles}
              className="bg-white border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 hover:border-l-[#081F45] p-3 rounded-sm shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex items-start gap-2.5"
            >
              <div className="p-1.5 rounded-xs bg-[#081F45]/5 text-[#081F45] group-hover:bg-[#081F45] group-hover:text-[#C79A3D] transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-playfair text-[#081F45] group-hover:text-[#184A87] transition-colors leading-tight">
                  {scope.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {scope.count} Published Studies
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Tags Cloud */}
        <div className="mt-6 bg-white p-4 rounded-sm border border-slate-200 text-left">
          <h3 className="text-xs font-bold text-[#081F45] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#C79A3D]" />
            <span>Comprehensive Discipline Keyword Index</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {fullScopesList.map((item, index) => (
              <span
                key={index}
                className="text-[11px] font-medium bg-[#F6F7F9] hover:bg-[#081F45] hover:text-[#C79A3D] border border-slate-200 px-2 py-0.5 rounded-xs transition-colors cursor-pointer"
                onClick={onNavigateToArticles}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
