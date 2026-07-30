import React from 'react';
import { 
  Send, 
  Search, 
  ShieldAlert, 
  EyeOff, 
  RotateCcw, 
  CheckCircle, 
  FileCheck, 
  FileCode, 
  Calendar,
  ChevronRight
} from 'lucide-react';

export const EditorialWorkflow: React.FC = () => {
  const steps = [
    { name: "Submission", desc: "Online manuscript submission", icon: Send, color: "bg-blue-600" },
    { name: "Initial Check", desc: "Format & scope validation", icon: Search, color: "bg-indigo-600" },
    { name: "Plagiarism Check", desc: "iThenticate / Turnitin screening", icon: ShieldAlert, color: "bg-purple-600" },
    { name: "Peer Review", desc: "Double-blind expert review", icon: EyeOff, color: "bg-[#081F45]" },
    { name: "Major Revision", desc: "Detailed author modifications", icon: RotateCcw, color: "bg-amber-600" },
    { name: "Minor Revision", desc: "Final reviewer checks", icon: CheckCircle, color: "bg-emerald-600" },
    { name: "Acceptance", desc: "Formal decision notification", icon: FileCheck, color: "bg-teal-600" },
    { name: "Proofreading", desc: "Typesetting & XML layout", icon: FileCheck, color: "bg-sky-600" },
    { name: "DOI Assignment", desc: "CrossRef registration", icon: FileCode, color: "bg-[#C79A3D]" },
    { name: "Quarterly Release", desc: "Open Access PDF publication", icon: Calendar, color: "bg-emerald-700" }
  ];

  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
          Quality & Integrity
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45] mt-1.5">
          Editorial & Peer Review Workflow
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 max-w-2xl mx-auto">
          Every manuscript submitted to IMJB undergoes rigorous, double-blind peer review following COPE ethical standards.
        </p>

        {/* Workflow Horizontal Stepper */}
        <div className="mt-6 overflow-x-auto pb-3 no-scrollbar">
          <div className="inline-flex items-center min-w-full gap-1.5 px-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center min-w-[115px] p-2.5 rounded-sm bg-slate-50 border border-slate-200 border-t-2 border-t-[#081F45] text-center hover:border-[#081F45] transition-all group">
                    <div className={`w-7 h-7 rounded-xs ${step.color} text-white flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#081F45] leading-tight">
                      {step.name}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
