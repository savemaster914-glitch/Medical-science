import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  Download, 
  Coins, 
  ShieldCheck, 
  AlertCircle, 
  Send,
  BookOpen,
  Award
} from 'lucide-react';

interface ForAuthorsSectionProps {
  onOpenSubmitModal: () => void;
}

export const ForAuthorsSection: React.FC<ForAuthorsSectionProps> = ({ onOpenSubmitModal }) => {
  const ethicalGuidelines = [
    { code: "COPE", title: "COPE Code of Conduct", desc: "Strict adherence to Committee on Publication Ethics principles." },
    { code: "ICMJE", title: "ICMJE Recommendations", desc: "Standardized medical journal authorship & disclosure standards." },
    { code: "CONSORT", title: "CONSORT Statement", desc: "Required for randomized clinical trial reporting." },
    { code: "PRISMA", title: "PRISMA 2020", desc: "Mandatory checklist for systematic reviews and meta-analyses." },
    { code: "STROBE", title: "STROBE Checklist", desc: "Reporting guidelines for observational epidemiological studies." },
    { code: "CARE", title: "CARE Guidelines", desc: "Framework for clinical case report preparation." },
    { code: "ARRIVE", title: "ARRIVE 2.0", desc: "Reporting of in vivo animal research and laboratory models." }
  ];

  const handleDownloadTemplate = () => {
    alert("Downloading IMJB Official Manuscript Template (.docx format)");
  };

  return (
    <section className="py-8 bg-[#F6F7F9] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
            Information for Authors
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
            Author Guidelines & Ethical Policies
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Everything you need to prepare, format, and submit your research manuscript to IMJB.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-white p-3.5 rounded-sm border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xs bg-blue-100 text-blue-900 flex items-center justify-center mb-2.5">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-playfair text-[#081F45]">Author Guidelines</h3>
            <p className="text-xs text-slate-600 mt-1 leading-normal font-sans">
              Formatting rules for Original Articles, Reviews, Case Reports, and Short Communications.
            </p>
            <button 
              onClick={onOpenSubmitModal}
              className="mt-3 text-[11px] font-bold text-[#184A87] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View Requirements</span>
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-sm border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xs bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2.5">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-playfair text-[#081F45]">Submission Checklist</h3>
            <p className="text-xs text-slate-600 mt-1 leading-normal font-sans">
              Ensure ORCID iDs, Title Page, Abstract (250 words), and COI statement are ready.
            </p>
            <button 
              onClick={onOpenSubmitModal}
              className="mt-3 text-[11px] font-bold text-[#184A87] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Checklist Overview</span>
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-sm border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xs bg-amber-100 text-amber-900 flex items-center justify-center mb-2.5">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-playfair text-[#081F45]">Template Download</h3>
            <p className="text-xs text-slate-600 mt-1 leading-normal font-sans">
              Download the official IMJB Word (.docx) manuscript template with pre-configured heading styles.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="mt-3 text-[10px] font-bold text-[#081F45] bg-[#C79A3D] px-2.5 py-1 rounded-xs hover:bg-[#b08835] uppercase tracking-wider transition-colors inline-flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3 h-3" />
              <span>Word Template</span>
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-sm border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 text-left shadow-2xs">
            <div className="w-7 h-7 rounded-xs bg-purple-100 text-purple-900 flex items-center justify-center mb-2.5">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-playfair text-[#081F45]">Publication Fees & Waivers</h3>
            <p className="text-xs text-slate-600 mt-1 leading-normal font-sans">
              Standard APC is $150 USD. <strong>100% Waivers</strong> are automatically granted for Iraqi institutions.
            </p>
            <button 
              onClick={onOpenSubmitModal}
              className="mt-3 text-[11px] font-bold text-[#184A87] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Apply for APC Waiver</span>
            </button>
          </div>
        </div>

        {/* Ethical Framework Badges */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-2xs text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#081F45]" />
            <h3 className="text-base font-bold font-playfair text-[#081F45]">
              International Publication Ethics & Reporting Guidelines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ethicalGuidelines.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-sm">
                <span className="text-[9px] font-extrabold uppercase bg-[#081F45] text-[#C79A3D] px-1.5 py-0.5 rounded-xs tracking-wider">
                  {item.code}
                </span>
                <h4 className="text-xs font-bold font-playfair text-[#081F45] mt-1.5">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 font-sans leading-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-sm flex items-start gap-2.5 text-xs text-amber-900 font-sans">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Patient Informed Consent & IRB Ethics Approval:</strong> All clinical research involving human subjects or patient tissues must include explicit statements confirming Institutional Review Board (IRB) ethical committee approval and written informed consent from all participants.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
