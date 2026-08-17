import React, { useState } from 'react';
import { X, Search, FileText, CheckCircle2, Clock, AlertTriangle, ArrowLeft, RefreshCw, Mail, ShieldCheck, Tag, Calendar, User, Building2 } from 'lucide-react';
import { SubmissionRecord } from '../types';

interface TrackManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: SubmissionRecord[];
  initialSearchQuery?: string;
}

export const TrackManuscriptModal: React.FC<TrackManuscriptModalProps> = ({
  isOpen,
  onClose,
  submissions,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);

  if (!isOpen) return null;

  // Filter submissions by ID, Tracking Code, Author Email, or Title
  const matches = submissions.filter(sub => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      sub.id.toLowerCase().includes(q) ||
      (sub.trackingCode && sub.trackingCode.toLowerCase().includes(q)) ||
      sub.authorEmail.toLowerCase().includes(q) ||
      sub.title.toLowerCase().includes(q) ||
      sub.correspondingAuthor.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: SubmissionRecord['status']) => {
    switch (status) {
      case 'Submitted':
        return {
          label: 'Submitted and undergoing initial check',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-600'
        };
      case 'Initial Check':
        return {
          label: 'Initial Check and compliance verification',
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          dot: 'bg-indigo-600'
        };
      case 'Under Review':
        return {
          label: 'Under Peer Review by reviewers board',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600'
        };
      case 'Revision Required':
        return {
          label: 'Revision Required based on reviewer feedback',
          color: 'bg-orange-100 text-orange-900 border-orange-300',
          dot: 'bg-orange-600'
        };
      case 'Accepted':
        return {
          label: 'Accepted for official publication in IMJB',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600'
        };
      case 'Rejected':
        return {
          label: 'Rejected (Not accepted for publication)',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-600'
        };
      case 'Published':
        return {
          label: 'Published in current issue',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          dot: 'bg-purple-600'
        };
      default:
        return {
          label: status,
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500'
        };
    }
  };

  const activeSub = selectedSubmission || (matches.length > 0 ? matches[0] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden text-left dir-ltr flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#081F45] text-white p-5 flex items-center justify-between border-b border-[#184A87]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C79A3D]/20 border border-[#C79A3D] text-[#C79A3D] rounded-full flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A3D] bg-white/10 px-2 py-0.5 rounded">
                  Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
                </span>
                <span className="text-[10px] text-slate-300 font-mono">OJS Tracking System</span>
              </div>
              <h2 className="text-lg font-bold font-playfair text-white mt-0.5">
                Track Manuscript Evaluation Status
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar Input & Quick Presets */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 space-y-3">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Manuscript ID (e.g., IMJB-2026-SUB-101) or author email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedSubmission(null);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#081F45] shadow-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Select Presets for testing */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-bold text-[11px] mr-1">Quick Search Presets:</span>
            {submissions.slice(0, 4).map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSearchQuery(sub.id);
                  setSelectedSubmission(sub);
                }}
                className="bg-white hover:bg-[#081F45] hover:text-white border border-slate-300 px-2.5 py-1 rounded text-[11px] font-mono text-slate-700 transition-colors"
              >
                {sub.id} ({sub.correspondingAuthor.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!searchQuery.trim() && !activeSub && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-[#081F45] rounded-full flex items-center justify-center mx-auto border border-blue-200 shadow-inner">
                <Search className="w-8 h-8 text-[#081F45]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-[#081F45]">Please enter Manuscript ID or author email to search</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Authors can monitor current manuscript status, peer review evaluation outcomes, and editorial board decision logs in real-time.
                </p>
              </div>
            </div>
          )}

          {searchQuery.trim() && matches.length === 0 && (
            <div className="text-center py-10 bg-amber-50/50 border border-amber-200 rounded-xl p-6">
              <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-amber-900">No manuscript found matching query</h3>
              <p className="text-xs text-amber-700 mt-1">
                Please make sure to enter the exact Manuscript ID (e.g. IMJB-2026-SUB-101) or the registered author email.
              </p>
            </div>
          )}

          {/* Multiple matches selector if user searched by email */}
          {matches.length > 1 && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
              <span className="text-xs font-bold text-[#081F45] block">
                Found ({matches.length}) manuscripts matching query. Select one to view details:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matches.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`p-2.5 rounded text-left border transition-all text-xs ${
                      activeSub?.id === sub.id
                        ? 'bg-[#081F45] text-white border-[#081F45] shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-[#081F45]'
                    }`}
                  >
                    <div className="font-bold truncate">{sub.title}</div>
                    <div className="text-[10px] opacity-80 flex items-center justify-between mt-1">
                      <span>{sub.id}</span>
                      <span>{sub.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Active Submission Details Card */}
          {activeSub && (
            <div className="space-y-6 animate-in fade-in">
              {/* Journal Header Banner */}
              <div className="bg-gradient-to-r from-[#081F45] to-[#184A87] text-white p-5 rounded-xl border border-[#184A87] space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-[#C79A3D] font-bold uppercase tracking-wider block">
                      Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-playfair text-white leading-snug">
                      {activeSub.title}
                    </h3>
                  </div>

                  <div className="text-left font-mono text-xs bg-white/10 px-3 py-1.5 rounded border border-white/20">
                    <div className="text-[#C79A3D] font-bold">{activeSub.id}</div>
                    <div className="text-[10px] text-slate-300">Tracking Code: {activeSub.trackingCode || 'TRK-98210'}</div>
                  </div>
                </div>

                {/* Sub Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#C79A3D]" />
                    <span><strong>Corresponding Author:</strong> {activeSub.correspondingAuthor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#C79A3D]" />
                    <span><strong>Email:</strong> {activeSub.authorEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C79A3D]" />
                    <span><strong>Submission Date:</strong> {activeSub.submissionDate}</span>
                  </div>
                </div>
              </div>

              {/* Current Status Box */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block mb-1">Current Journal Status:</span>
                    {(() => {
                      const badge = getStatusBadge(activeSub.status);
                      return (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${badge.color}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${badge.dot} animate-ping`}></span>
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                    <div><strong>Specialty Scope:</strong> {activeSub.scope}</div>
                    <div><strong>Article Type:</strong> {activeSub.articleType}</div>
                  </div>
                </div>

                {/* Visual Workflow Stage Bar */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-[#081F45] block">
                    Editorial Evaluation Stages:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    {/* Stage 1: Submitted */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      ['Submitted', 'Initial Check', 'Under Review', 'Revision Required', 'Accepted', 'Rejected', 'Published'].includes(activeSub.status)
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px]">1. Submitted</span>
                    </div>

                    {/* Stage 2: Initial Check */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      ['Initial Check', 'Under Review', 'Revision Required', 'Accepted', 'Rejected', 'Published'].includes(activeSub.status)
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-[11px]">2. Initial Check</span>
                    </div>

                    {/* Stage 3: Peer Review */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      ['Under Review', 'Revision Required', 'Accepted', 'Rejected', 'Published'].includes(activeSub.status)
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-[11px]">3. Peer Review</span>
                    </div>

                    {/* Stage 4: Revisions */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      ['Revision Required', 'Accepted', 'Published'].includes(activeSub.status)
                        ? 'bg-orange-50 border-orange-300 text-orange-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      <RefreshCw className="w-4 h-4 text-orange-600" />
                      <span className="text-[11px]">4. Revisions</span>
                    </div>

                    {/* Stage 5: Final Decision */}
                    <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
                      activeSub.status === 'Accepted' || activeSub.status === 'Published'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : activeSub.status === 'Rejected'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      {activeSub.status === 'Rejected' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      <span className="text-[11px]">
                        {activeSub.status === 'Accepted'
                          ? '5. Accepted'
                          : activeSub.status === 'Rejected'
                          ? '5. Rejected'
                          : activeSub.status === 'Published'
                          ? '5. Published'
                          : '5. Final Decision'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviewers Assigned & Reports Feedback (If any) */}
              {activeSub.assignedReviewers && activeSub.assignedReviewers.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Peer Reviewers Status</span>
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                      {activeSub.assignedReviewers.length} Reviewers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeSub.assignedReviewers.map((rev, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-amber-200 space-y-1">
                        <div className="font-bold text-[#081F45] flex items-center justify-between">
                          <span>Reviewer #{idx + 1} ({rev.reviewerName})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            rev.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rev.status === 'Completed' ? 'Report Submitted' : 'Under Review'}
                          </span>
                        </div>
                        {rev.recommendation && (
                          <div className="text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-100 mt-1">
                            <strong>Recommendation:</strong> {rev.recommendation}
                          </div>
                        )}
                        {rev.commentsToAuthor && (
                          <div className="text-[11px] text-slate-600 italic">
                            "{rev.commentsToAuthor}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Logs Audit Trail */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#081F45] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C79A3D]" />
                  <span>Editorial History Logs & Decisions:</span>
                </h4>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  {activeSub.logs && activeSub.logs.length > 0 ? (
                    activeSub.logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs border-b border-slate-200/80 last:border-0 pb-2 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-[#081F45] mt-1.5 flex-shrink-0"></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#081F45]">{log.action}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{log.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Executed by: {log.actor || 'Editor-in-Chief'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-2">
                      Manuscript received and undergoing initial review by editorial board.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Real-time synchronization with IMJB OJS Portal
          </span>
          <button
            onClick={onClose}
            className="bg-[#081F45] hover:bg-[#184A87] text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
