import React from 'react';
import { JOURNAL_INFO } from '../data/mockJournalData';
import { 
  Building2, 
  Globe2, 
  CalendarDays, 
  Languages, 
  Unlock, 
  ShieldCheck, 
  Barcode, 
  FileCode, 
  CreativeCommons, 
  Coins 
} from 'lucide-react';

export const JournalInfoCards: React.FC = () => {
  const infoItems = [
    {
      icon: Building2,
      label: "Publisher",
      value: JOURNAL_INFO.publisher,
      subvalue: `${JOURNAL_INFO.institution}, ${JOURNAL_INFO.directorate}`,
      color: "text-[#081F45] bg-blue-50 border-blue-200"
    },
    {
      icon: Globe2,
      label: "Country",
      value: JOURNAL_INFO.country,
      subvalue: "Dhi Qar Governorate, Iraq",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      icon: CalendarDays,
      label: "Publication Frequency",
      value: "Quarterly Journal",
      subvalue: "March • June • September • December",
      highlight: true,
      color: "text-[#081F45] bg-[#C79A3D]/10 border-[#C79A3D]/40"
    },
    {
      icon: Languages,
      label: "Language",
      value: JOURNAL_INFO.language,
      subvalue: "Official Publishing Language",
      color: "text-purple-700 bg-purple-50 border-purple-200"
    },
    {
      icon: Unlock,
      label: "Access",
      value: "Open Access",
      subvalue: "Immediate Global Availability",
      color: "text-amber-700 bg-amber-50 border-amber-200"
    },
    {
      icon: ShieldCheck,
      label: "Peer Review",
      value: JOURNAL_INFO.peerReview,
      subvalue: "Rigorous International Evaluation",
      color: "text-teal-700 bg-teal-50 border-teal-200"
    },
    {
      icon: Barcode,
      label: "ISSN Registered",
      value: `${JOURNAL_INFO.issnOnline} (Online)`,
      subvalue: `${JOURNAL_INFO.issnPrint} (Print)`,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200"
    },
    {
      icon: FileCode,
      label: "Digital Identifier (DOI)",
      value: "CrossRef Registered",
      subvalue: `Prefix: ${JOURNAL_INFO.doiPrefix}`,
      color: "text-rose-700 bg-rose-50 border-rose-200"
    },
    {
      icon: CreativeCommons,
      label: "Copyright & License",
      value: "CC BY 4.0",
      subvalue: "Creative Commons Attribution 4.0",
      color: "text-sky-700 bg-sky-50 border-sky-200"
    },
    {
      icon: Coins,
      label: "Article Processing Charges",
      value: "$150 USD / Waived",
      subvalue: "Full Waivers for Iraqi Institutional Authors",
      color: "text-green-700 bg-green-50 border-green-200"
    }
  ];

  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A3D] bg-[#081F45] px-2.5 py-0.5 rounded-xs">
            Key Metadata
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45] mt-1.5">
            Journal Information & Specifications
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Published four times annually by the Department of Medical Laboratories, Al-Habbobi Teaching Hospital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-3 rounded-sm border transition-all hover:border-[#081F45] ${
                  item.highlight ? 'ring-1 ring-[#C79A3D] bg-amber-50/40 border-[#C79A3D]' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-xs flex items-center justify-center mb-2 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</div>
                <div className="text-xs font-bold text-[#081F45] mt-0.5 leading-tight">{item.value}</div>
                <div className="text-[10px] text-slate-600 mt-1 leading-tight">{item.subvalue}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
