import React from 'react';
import { Calendar, Clock, CheckCircle2, Send } from 'lucide-react';

interface PublicationScheduleProps {
  onOpenSubmitModal: () => void;
}

export const PublicationSchedule: React.FC<PublicationScheduleProps> = ({ onOpenSubmitModal }) => {
  const schedule = [
    {
      issue: "Issue 1",
      month: "March",
      publishDate: "March 30",
      submissionDeadline: "January 15",
      status: "Published",
      isCurrent: true,
      badge: "Current Issue"
    },
    {
      issue: "Issue 2",
      month: "June",
      publishDate: "June 30",
      submissionDeadline: "April 30",
      status: "Open for Submissions",
      isNext: true,
      badge: "Call for Papers"
    },
    {
      issue: "Issue 3",
      month: "September",
      publishDate: "September 30",
      submissionDeadline: "July 31",
      status: "Upcoming",
      badge: "Scheduled"
    },
    {
      issue: "Issue 4",
      month: "December",
      publishDate: "December 30",
      submissionDeadline: "October 31",
      status: "Upcoming",
      badge: "Scheduled"
    }
  ];

  return (
    <section className="py-8 bg-[#F6F7F9] border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
            Quarterly Frequency
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45] mt-1.5">
            Annual Publication Schedule & Submission Deadlines
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            IMJB publishes four regular quarterly issues annually (March, June, September, December).
          </p>
        </div>

        {/* Timeline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 relative">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-sm p-4 border transition-all relative text-left shadow-2xs border-l-4 ${
                item.isCurrent
                  ? 'bg-white border-[#081F45] border-l-[#081F45]'
                  : item.isNext
                  ? 'bg-amber-50/50 border-[#C79A3D] border-l-[#C79A3D]'
                  : 'bg-white border-slate-200 border-l-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-xs tracking-wider ${
                  item.isCurrent 
                    ? 'bg-[#081F45] text-white' 
                    : item.isNext 
                    ? 'bg-[#C79A3D] text-[#081F45]' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">0{idx + 1}</span>
              </div>

              <h3 className="text-base font-bold font-playfair text-[#081F45]">
                {item.issue} — {item.month}
              </h3>

              <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-600 font-sans">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#184A87]" />
                  <span><strong>Publish Date:</strong> {item.publishDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span><strong>Deadline:</strong> {item.submissionDeadline}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {item.status}
                </span>
                {item.isNext && (
                  <button
                    onClick={onOpenSubmitModal}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#081F45] bg-[#C79A3D] px-2.5 py-1 rounded-xs hover:bg-[#b08835] uppercase tracking-wider shadow-2xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
