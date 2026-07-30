import React from 'react';
import { MOCK_ANNOUNCEMENTS } from '../data/mockJournalData';
import { Bell, Calendar, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { ActivePage } from '../types';

interface AnnouncementsSectionProps {
  onNavigate: (page: ActivePage) => void;
  onOpenSubmitModal: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  onNavigate,
  onOpenSubmitModal,
}) => {
  return (
    <section className="py-8 bg-[#F6F7F9] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
              Journal Updates
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
              Announcements & Editorial News
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Stay updated with calls for papers, special issues, and upcoming medical conferences.
            </p>
          </div>

          <button
            onClick={() => onNavigate('announcements')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#184A87] hover:underline uppercase tracking-wider"
          >
            <span>View All Announcements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Announcement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white border-l-4 p-3.5 rounded-sm transition-all shadow-2xs hover:shadow-xs text-left flex flex-col justify-between ${
                ann.isUrgent ? 'border-l-[#C79A3D] border-t border-r border-b border-slate-200' : 'border-l-[#081F45] border-t border-r border-b border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-xs tracking-wider ${
                    ann.isUrgent 
                      ? 'bg-[#C79A3D] text-[#081F45]' 
                      : 'bg-[#081F45] text-white'
                  }`}>
                    {ann.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
                    <Calendar className="w-3 h-3" />
                    <span>{ann.date}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold font-playfair text-[#081F45] leading-tight">
                  {ann.title}
                </h3>

                <p className="text-xs text-slate-600 leading-normal font-sans">
                  {ann.content}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (ann.category === 'Call for Papers') {
                      onOpenSubmitModal();
                    } else {
                      onNavigate('announcements');
                    }
                  }}
                  className="text-[11px] font-bold text-[#184A87] hover:text-[#081F45] flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>{ann.linkText || 'Read Announcement'}</span>
                  <ArrowRight className="w-3 h-3 text-[#C79A3D]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
