import React from 'react';
import { JournalLogo } from './JournalLogo';
import { ActivePage } from '../types';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink,
  ShieldCheck,
  CreativeCommons,
  Send,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSubmitModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSubmitModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#081F45] text-white border-t-4 border-t-[#C79A3D] relative no-print font-sans">
      {/* Top Footer Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-b border-[#184A87]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 flex items-center gap-3 text-left">
            <JournalLogo size="md" className="flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed">
                The <strong>Iraqi Medical Journal for Biomedicine (IMJB)</strong> is an international peer-reviewed open-access quarterly biomedical journal published by the Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end gap-2">
            <button
              onClick={onOpenSubmitModal}
              className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-bold text-[11px] px-3.5 py-1.5 rounded-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Manuscript</span>
            </button>
            <button
              onClick={scrollToTop}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left text-xs">
        {/* Column 1: About Journal */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-playfair text-[#C79A3D] uppercase tracking-wider">
            About Journal
          </h4>
          <p className="text-slate-300 leading-normal font-sans text-[11px]">
            IMJB publishes high-quality original research, systematic reviews, case reports, and short communications across laboratory medicine, pathology, microbiology, clinical chemistry, and molecular diagnostics.
          </p>
          <div className="pt-1.5 text-slate-400 space-y-0.5 text-[11px]">
            <div><strong>Frequency:</strong> Quarterly (Mar, Jun, Sep, Dec)</div>
            <div><strong>Access Policy:</strong> Open Access (CC BY 4.0)</div>
            <div><strong>ISSN (Online):</strong> 2958-8421</div>
          </div>
        </div>

        {/* Column 2: Quick Navigation Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-playfair text-[#C79A3D] uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-1 text-slate-300 font-medium text-[11px]">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#C79A3D] transition-colors">Home Page</button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-[#C79A3D] transition-colors">About Journal & Information</button>
            </li>
            <li>
              <button onClick={() => onNavigate('current-issue')} className="hover:text-[#C79A3D] transition-colors">Current Issue (Vol 4, Issue 1)</button>
            </li>
            <li>
              <button onClick={() => onNavigate('archives')} className="hover:text-[#C79A3D] transition-colors">Journal Archives</button>
            </li>
            <li>
              <button onClick={() => onNavigate('editorial-board')} className="hover:text-[#C79A3D] transition-colors">Editorial Board Directory</button>
            </li>
            <li>
              <button onClick={() => onNavigate('for-authors')} className="hover:text-[#C79A3D] transition-colors">Author Guidelines & Template</button>
            </li>
            <li>
              <button onClick={() => onNavigate('ethics')} className="hover:text-[#C79A3D] transition-colors">Publication Ethics (COPE)</button>
            </li>
            <li>
              <button onClick={() => onNavigate('indexing')} className="hover:text-[#C79A3D] transition-colors">Indexing & Databases</button>
            </li>
          </ul>
        </div>

        {/* Column 3: Publisher Information */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-playfair text-[#C79A3D] uppercase tracking-wider">
            Publisher Information
          </h4>
          <div className="space-y-1.5 text-slate-300 font-sans text-[11px]">
            <div className="flex items-start gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C79A3D] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Department of Medical Laboratories</strong>
                <span>Al-Habbobi Teaching Hospital</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C79A3D] flex-shrink-0 mt-0.5" />
              <div>
                <span>Thi-Qar Health Directorate</span>
                <span className="block text-slate-400">Dhi Qar Governorate, Iraq</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#184A87] text-slate-400 text-[10px]">
              <span>Primary Tertiary Medical Teaching Hospital Reference Center in Southern Iraq.</span>
            </div>
          </div>
        </div>

        {/* Column 4: Contact & Social Media */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-playfair text-[#C79A3D] uppercase tracking-wider">
            Contact & Support
          </h4>
          <div className="space-y-1.5 text-slate-300 font-sans text-[11px]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C79A3D]" />
              <a href="mailto:editor@imjb-iq.org" className="hover:underline text-white font-mono">editor@imjb-iq.org</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C79A3D]" />
              <span className="font-mono">+964 780 123 4567</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#184A87]">
            <span className="text-slate-400 font-semibold block mb-1.5 text-[10px] uppercase tracking-wider">Scientific Networks:</span>
            <div className="flex flex-wrap gap-1">
              {['Facebook', 'LinkedIn', 'ResearchGate', 'X (Twitter)', 'YouTube'].map(net => (
                <span
                  key={net}
                  className="px-2 py-0.5 bg-white/10 hover:bg-[#C79A3D] hover:text-[#081F45] font-bold rounded-xs text-[9px] transition-colors cursor-pointer"
                >
                  {net}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="bg-[#041126] py-3 border-t border-[#184A87] text-center text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="text-[11px]">
            © {new Date().getFullYear()} <strong>Iraqi Medical Journal for Biomedicine (IMJB)</strong>. Department of Medical Laboratories, Al-Habbobi Teaching Hospital.
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-[#C79A3D]">
              <CreativeCommons className="w-3 h-3" />
              <span>CC BY 4.0 License</span>
            </span>
            <button onClick={() => onNavigate('contact')} className="hover:underline">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
