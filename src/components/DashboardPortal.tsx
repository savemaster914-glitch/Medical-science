import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  UserCheck, 
  Send, 
  Upload, 
  Eye, 
  Search,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  UserPlus,
  Mail,
  X,
  Check,
  RotateCcw,
  ShieldCheck,
  FileSpreadsheet,
  MessageSquare,
  ArrowRight,
  Filter,
  Database
} from 'lucide-react';
import { SubmissionRecord, AssignedReviewer, ArticleType } from '../types';
import { INITIAL_ADMIN_SUBMISSIONS, ACRREDITED_REVIEWERS } from '../data/adminMockData';
import { updateSubmissionInDB } from '../db/localRealmDB';

interface DashboardPortalProps {
  onOpenSubmitModal: () => void;
  onOpenRealmDb?: () => void;
  submissions?: SubmissionRecord[];
  setSubmissions?: React.Dispatch<React.SetStateAction<SubmissionRecord[]>>;
}

type StatusFilter = 'All' | 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected' | 'Published';

export const DashboardPortal: React.FC<DashboardPortalProps> = ({ 
  onOpenSubmitModal,
  onOpenRealmDb,
  submissions: externalSubmissions,
  setSubmissions: externalSetSubmissions
}) => {
  const [role, setRole] = useState<'editor' | 'author' | 'reviewer'>('editor');

  // Internal fallback state if external isn't passed
  const [internalSubmissions, setInternalSubmissions] = useState<SubmissionRecord[]>(INITIAL_ADMIN_SUBMISSIONS);
  
  const submissions = externalSubmissions || internalSubmissions;
  const setSubmissions = externalSetSubmissions || setInternalSubmissions;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  // Modals state
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Assign Reviewer Form State
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>([]);
  const [reviewerDeadline, setReviewerDeadline] = useState('2026-04-20');
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Decision Form State
  const [decisionType, setDecisionType] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>('Accept');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Edit Manuscript Form State
  const [editFormData, setEditFormData] = useState<Partial<SubmissionRecord>>({});

  // Add Manuscript Form State
  const [newManuscript, setNewManuscript] = useState({
    title: '',
    correspondingAuthor: '',
    authorEmail: '',
    institution: '',
    articleType: 'Original Research' as ArticleType,
    scope: 'Medical Microbiology & Virology',
    abstract: '',
    keywords: ''
  });

  // Action: Open Assign Reviewers Modal
  const handleOpenAssignModal = (sub: SubmissionRecord) => {
    setSelectedSubmission(sub);
    const existingIds = sub.assignedReviewers?.map(r => r.id) || [];
    setSelectedReviewerIds(existingIds);
    setReviewerNotes('');
    setIsAssignModalOpen(true);
  };

  // Action: Save Reviewers Assignment
  const handleSaveReviewers = () => {
    if (!selectedSubmission) return;

    const assigned: AssignedReviewer[] = ACRREDITED_REVIEWERS.filter(r => selectedReviewerIds.includes(r.id)).map(r => ({
      ...r,
      status: 'Pending',
      dueDate: reviewerDeadline
    }));

    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          status: 'Under Review',
          assignedReviewers: assigned,
          logs: [
            ...(s.logs || []),
            {
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              action: `Assigned ${assigned.length} Peer Reviewer(s)`,
              actor: 'Editor-in-Chief',
              notes: reviewerNotes
            }
          ]
        };
      }
      return s;
    }));

    setIsAssignModalOpen(false);
    showToast(`✅ Successfully assigned ${assigned.length} reviewer(s) to manuscript ${selectedSubmission.id} and sent invitations.`);
  };

  // Action: Open Decision & Response Modal
  const handleOpenDecisionModal = (sub: SubmissionRecord, type: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject') => {
    setSelectedSubmission(sub);
    setDecisionType(type);
    
    // Pre-populate response email template
    if (type === 'Accept') {
      setEmailSubject(`IMJB Acceptance Notice: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nWe are pleased to inform you that your manuscript titled "${sub.title}" has been formally ACCEPTED for publication in the Iraqi Medical Journal for Biomedicine (IMJB).\n\nYour manuscript will be assigned to Volume 4, Issue 2 (June 2026).\n\nBest regards,\nEditorial Board, IMJB`);
    } else if (type === 'Minor Revision' || type === 'Major Revision') {
      setEmailSubject(`IMJB Editorial Decision - ${type}: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nFollowing peer review evaluation of your manuscript "${sub.title}", the Editorial Board requests ${type.toUpperCase()} before final acceptance.\n\nPlease address the reviewer comments below and resubmit within 14 days.\n\nBest regards,\nEditorial Office, IMJB`);
    } else {
      setEmailSubject(`IMJB Editorial Decision - Rejection: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nThank you for submitting your research manuscript "${sub.title}" to the Iraqi Medical Journal for Biomedicine.\n\nAfter thorough editorial review, we regret to inform you that your manuscript cannot be accepted for publication at this time.\n\nWe wish you success in placing your work elsewhere.\n\nSincerely,\nEditor-in-Chief, IMJB`);
    }

    setInternalNotes('');
    setIsDecisionModalOpen(true);
  };

  // Action: Save Editorial Decision & Author Response
  const handleSaveDecision = () => {
    if (!selectedSubmission) return;

    let newStatus: SubmissionRecord['status'] = 'Under Review';
    if (decisionType === 'Accept') newStatus = 'Accepted';
    if (decisionType === 'Minor Revision' || decisionType === 'Major Revision') newStatus = 'Revision Required';
    if (decisionType === 'Reject') newStatus = 'Rejected';

    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          status: newStatus,
          decisionNotes: internalNotes || emailMessage,
          rejectionReason: decisionType === 'Reject' ? internalNotes : undefined,
          logs: [
            ...(s.logs || []),
            {
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              action: `Editorial Decision Issued: ${decisionType}`,
              actor: 'Editor-in-Chief',
              notes: emailSubject
            }
          ]
        };
      }
      return s;
    }));

    setIsDecisionModalOpen(false);
    showToast(`📩 Decision (${decisionType}) saved & official notification email sent to ${selectedSubmission.authorEmail}`);
  };

  // Action: Open Edit Modal
  const handleOpenEditModal = (sub: SubmissionRecord) => {
    setSelectedSubmission(sub);
    setEditFormData(sub);
    setIsEditModalOpen(true);
  };

  // Action: Save Edit Manuscript
  const handleSaveEdit = () => {
    if (!selectedSubmission) return;

    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedSubmission.id) {
        return {
          ...s,
          ...editFormData
        } as SubmissionRecord;
      }
      return s;
    }));

    setIsEditModalOpen(false);
    showToast(`✏️ Manuscript ${selectedSubmission.id} updated successfully.`);
  };

  // Action: Delete Manuscript
  const handleDeleteSubmission = () => {
    if (!selectedSubmission) return;

    setSubmissions(prev => prev.filter(s => s.id !== selectedSubmission.id));
    setIsDeleteConfirmOpen(false);
    setSelectedSubmission(null);
    showToast(`🗑️ Manuscript ${selectedSubmission.id} was deleted from the portal.`);
  };

  // Action: Add New Manuscript
  const handleAddNewManuscript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManuscript.title || !newManuscript.correspondingAuthor || !newManuscript.authorEmail) return;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newRecord: SubmissionRecord = {
      id: `IMJB-2026-SUB-${randomNum}`,
      trackingCode: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      title: newManuscript.title,
      articleType: newManuscript.articleType,
      scope: newManuscript.scope,
      correspondingAuthor: newManuscript.correspondingAuthor,
      authorEmail: newManuscript.authorEmail,
      institution: newManuscript.institution || 'Al-Habbobi Teaching Hospital',
      submissionDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Submitted',
      abstract: newManuscript.abstract || 'Abstract details submitted by author.',
      keywords: newManuscript.keywords ? newManuscript.keywords.split(',').map(k => k.trim()) : ['Biomedicine'],
      assignedReviewers: [],
      logs: [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          action: 'Manuscript Submitted to Admin Queue',
          actor: 'Admin'
        }
      ]
    };

    setSubmissions([newRecord, ...submissions]);
    setIsAddModalOpen(false);
    setNewManuscript({
      title: '',
      correspondingAuthor: '',
      authorEmail: '',
      institution: '',
      articleType: 'Original Research',
      scope: 'Medical Microbiology & Virology',
      abstract: '',
      keywords: ''
    });
    showToast(`➕ New manuscript ${newRecord.id} added successfully to the admin queue!`);
  };

  // Filtered Submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.correspondingAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.scope.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' ? true : sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Counters
  const totalCount = submissions.length;
  const unassignedCount = submissions.filter(s => s.status === 'Submitted' || s.status === 'Initial Check').length;
  const underReviewCount = submissions.filter(s => s.status === 'Under Review').length;
  const revisionCount = submissions.filter(s => s.status === 'Revision Required').length;
  const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;
  const rejectedCount = submissions.filter(s => s.status === 'Rejected').length;

  return (
    <section className="py-8 bg-[#F6F7F9] min-h-[85vh] font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#081F45] text-white text-xs font-semibold px-4 py-3 rounded-sm shadow-xl border-l-4 border-l-[#C79A3D] flex items-center gap-2 animate-in slide-in-from-right-2">
          <CheckCircle className="w-4 h-4 text-[#C79A3D] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Ribbon */}
        <div className="bg-[#081F45] text-white p-5 rounded-sm shadow-md border-t-4 border-t-[#C79A3D] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xs bg-[#C79A3D] text-[#081F45] flex items-center justify-center font-bold flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C79A3D] bg-white/10 px-2 py-0.5 rounded-xs">
                  OJS 3.4 Editorial Control Panel
                </span>
                <span className="text-[10px] font-bold text-slate-300 dir-rtl font-sans">
                  لوحة تحكم مدير المجلة واستقبال البحوث
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-playfair text-white mt-0.5">
                Manuscript Receiving & Peer Review Management System
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Department of Medical Laboratories • Al-Habbobi Teaching Hospital, Dhi Qar, Iraq
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            {onOpenRealmDb && (
              <button
                onClick={onOpenRealmDb}
                className="bg-white/10 hover:bg-white/20 text-[#C79A3D] border border-[#C79A3D]/40 font-bold text-xs px-3.5 py-2 rounded-xs flex items-center gap-1.5 transition-all shadow-2xs"
                title="فتح لوحة فحص ومعاينة قاعدة البيانات المحلية Realm DB"
              >
                <Database className="w-4 h-4 text-[#C79A3D]" />
                <span>قاعدة البيانات Realm DB</span>
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-bold text-xs px-3.5 py-2 rounded-xs flex items-center gap-1.5 uppercase tracking-wider transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة بحث جديد / Add Manuscript</span>
            </button>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-sm border border-slate-200 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Portal View Mode:</span>
            <button
              onClick={() => setRole('editor')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                role === 'editor'
                  ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🛡️ Editor-in-Chief Admin (لوحة الأدمن)
            </button>
            <button
              onClick={() => setRole('reviewer')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                role === 'reviewer'
                  ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              👨‍🏫 Reviewer Queue (لوحة المحكمين)
            </button>
            <button
              onClick={() => setRole('author')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                role === 'author'
                  ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✍️ Author Portal (لوحة الباحثين)
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Active Manuscripts in Database: <strong className="text-[#081F45] font-bold">{totalCount}</strong>
          </div>
        </div>

        {/* EDITOR ADMIN DASHBOARD */}
        {role === 'editor' && (
          <div className="space-y-6">
            {/* New Submission Alert Banner */}
            {unassignedCount > 0 && (
              <div className="bg-gradient-to-r from-blue-900 to-[#081F45] text-white p-4 rounded-xs border-l-4 border-l-[#C79A3D] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xs bg-[#C79A3D] text-[#081F45] flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-2xs">
                    <Send className="w-5 h-5 text-[#081F45]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#C79A3D] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>وارد جديد: يوجد {unassignedCount} بحث مرفوع حديثاً من الباحثين بانتظار المراجعة والفرز والتوجيه للمقيمين</span>
                    </div>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      {unassignedCount} new manuscript(s) submitted by authors ready for editorial screening and peer-reviewer assignment.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStatusFilter('Submitted')}
                  className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-extrabold text-xs px-3.5 py-1.5 rounded-xs whitespace-nowrap uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all"
                >
                  <span>إظهار الأبحاث الواردة حديثاً ({unassignedCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* KPI Statistics Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
              <div 
                onClick={() => setStatusFilter('All')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-[#081F45] border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'All' ? 'ring-2 ring-[#081F45]' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">All Submissions</div>
                <div className="text-xl font-bold font-playfair text-[#081F45] mt-0.5">{totalCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">إجمالي الأبحاث</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Submitted')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-blue-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Submitted' ? 'ring-2 ring-blue-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">Unassigned</div>
                <div className="text-xl font-bold font-playfair text-blue-900 mt-0.5">{unassignedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">وارد حديثاً / فرز</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Under Review')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-purple-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Under Review' ? 'ring-2 ring-purple-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Under Review</div>
                <div className="text-xl font-bold font-playfair text-purple-900 mt-0.5">{underReviewCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">قيد التحكيم</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Revision Required')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-amber-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Revision Required' ? 'ring-2 ring-amber-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Revisions</div>
                <div className="text-xl font-bold font-playfair text-amber-900 mt-0.5">{revisionCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">مطلوب تعديل</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Accepted')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Accepted' ? 'ring-2 ring-emerald-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Accepted</div>
                <div className="text-xl font-bold font-playfair text-emerald-900 mt-0.5">{acceptedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">أبحاث مقبولة</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Rejected')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-rose-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Rejected' ? 'ring-2 ring-rose-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Rejected</div>
                <div className="text-xl font-bold font-playfair text-rose-900 mt-0.5">{rejectedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">أبحاث مرفوضة</div>
              </div>
            </div>

            {/* Submissions Control Table Toolbar */}
            <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs space-y-4 text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#081F45]" />
                  <h3 className="text-base font-bold font-playfair text-[#081F45]">
                    Manuscripts Submission & Peer Review Control Queue
                  </h3>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID, title, author, scope..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xs text-xs focus:ring-1 focus:ring-[#081F45] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Tabs Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {(['All', 'Submitted', 'Under Review', 'Revision Required', 'Accepted', 'Rejected'] as StatusFilter[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-xs text-[11px] font-bold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#081F45] text-[#C79A3D]'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' ? 'All (الكل)' : st}
                  </button>
                ))}
              </div>

              {/* Manuscripts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#081F45] text-[#C79A3D] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3 border-b border-[#184A87]">Submission Code & Date</th>
                      <th className="p-3 border-b border-[#184A87]">Manuscript Title & Author</th>
                      <th className="p-3 border-b border-[#184A87]">Scope & Type</th>
                      <th className="p-3 border-b border-[#184A87]">Status (الحالة)</th>
                      <th className="p-3 border-b border-[#184A87]">Assigned Reviewers (المقيمين)</th>
                      <th className="p-3 border-b border-[#184A87] text-right">Admin Actions (الإجراءات)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No manuscripts found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          {/* Submission ID & Date */}
                          <td className="p-3 align-top font-mono">
                            <span className="font-bold text-[#081F45] block">{sub.id}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{sub.submissionDate}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-xs mt-1 inline-block">
                              {sub.trackingCode}
                            </span>
                          </td>

                          {/* Title & Author */}
                          <td className="p-3 align-top max-w-xs">
                            <h4 className="font-bold font-playfair text-[#081F45] text-xs leading-snug line-clamp-2">
                              {sub.title}
                            </h4>
                            <div className="mt-1 text-[11px] text-slate-600">
                              <strong className="text-slate-800">{sub.correspondingAuthor}</strong>
                              <span className="text-slate-400 block text-[10px]">{sub.authorEmail}</span>
                            </div>
                          </td>

                          {/* Scope & Type */}
                          <td className="p-3 align-top text-[11px]">
                            <span className="font-bold text-slate-700 block">{sub.articleType}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{sub.scope}</span>
                          </td>

                          {/* Status */}
                          <td className="p-3 align-top">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-xs tracking-wider ${
                              sub.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : sub.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                : sub.status === 'Revision Required'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : sub.status === 'Under Review'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}>
                              {sub.status === 'Submitted' ? 'Submitted (مقدم حديثاً)' : sub.status}
                            </span>
                          </td>

                          {/* Reviewers */}
                          <td className="p-3 align-top text-[11px]">
                            {sub.assignedReviewers && sub.assignedReviewers.length > 0 ? (
                              <div className="space-y-1">
                                {sub.assignedReviewers.map((rev, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xs">
                                    <UserCheck className="w-3 h-3 text-[#184A87] flex-shrink-0" />
                                    <span className="truncate font-medium text-[10px]">{rev.name}</span>
                                    {rev.recommendation && (
                                      <span className={`ml-auto text-[9px] font-bold px-1 rounded-xs ${
                                        rev.recommendation === 'Accept' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                                      }`}>
                                        {rev.recommendation}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-semibold italic block bg-amber-50 px-2 py-1 rounded-xs border border-amber-200">
                                No reviewers assigned yet
                              </span>
                            )}
                          </td>

                          {/* Admin Actions */}
                          <td className="p-3 align-top text-right space-y-1">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {/* View Details */}
                              <button
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setIsViewModalOpen(true);
                                }}
                                title="View Manuscript Details & Abstract"
                                className="p-1.5 bg-slate-100 hover:bg-[#081F45] hover:text-white rounded-xs transition-colors text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Assign Reviewers */}
                              <button
                                onClick={() => handleOpenAssignModal(sub)}
                                title="Forward / Assign to Peer Reviewers (توجيه للمقيمين)"
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-700 text-purple-900 hover:text-white border border-purple-200 rounded-xs transition-colors text-[10px] font-bold flex items-center gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>توجيه لمقيم</span>
                              </button>

                              {/* Decision & Author Email */}
                              <div className="relative group inline-block">
                                <button
                                  onClick={() => handleOpenDecisionModal(sub, 'Accept')}
                                  title="Issue Acceptance / Revisions / Rejection (الرد لاتخاذ القرار)"
                                  className="px-2 py-1 bg-[#081F45] text-[#C79A3D] hover:bg-[#184A87] rounded-xs transition-colors text-[10px] font-bold flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>رد للباحث</span>
                                </button>
                              </div>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditModal(sub)}
                                title="Edit Manuscript Details (تعديل)"
                                className="p-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white border border-amber-200 text-amber-900 rounded-xs transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                title="Delete Manuscript (حذف)"
                                className="p-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-800 rounded-xs transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Quick Decision Shortcuts */}
                            <div className="pt-1 flex items-center justify-end gap-1 text-[9px]">
                              <button
                                onClick={() => handleOpenDecisionModal(sub, 'Accept')}
                                className="text-emerald-700 hover:underline font-bold"
                              >
                                [قبول Accept]
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                onClick={() => handleOpenDecisionModal(sub, 'Minor Revision')}
                                className="text-amber-700 hover:underline font-bold"
                              >
                                [تعديل Revision]
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                onClick={() => handleOpenDecisionModal(sub, 'Reject')}
                                className="text-rose-700 hover:underline font-bold"
                              >
                                [رفض Reject]
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWER QUEUE VIEW */}
        {role === 'reviewer' && (
          <div className="bg-white p-6 rounded-sm border border-slate-200 text-left space-y-6 shadow-2xs">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Double-Blind Peer Reviewer Workspace:</strong> You are evaluating manuscripts assigned by the Editor-in-Chief. Please complete evaluations within 14 days of acceptance.
              </div>
            </div>

            <h3 className="text-lg font-bold font-playfair text-[#081F45]">
              Assigned Manuscripts for Peer Evaluation
            </h3>

            <div className="space-y-4">
              {submissions.filter(s => s.status === 'Under Review').map((sub) => (
                <div key={sub.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-bold">{sub.id}</span>
                    <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-xs text-[10px]">
                      Due in 7 Days
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-playfair text-[#081F45]">{sub.title}</h4>
                  <p className="text-xs text-slate-600">Scope: {sub.scope} • Article Type: {sub.articleType}</p>
                  
                  <div className="bg-white p-3 rounded-xs border border-slate-200 text-xs text-slate-700">
                    <strong>Abstract Preview:</strong> {sub.abstract}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleOpenDecisionModal(sub, 'Accept')}
                      className="bg-[#081F45] text-[#C79A3D] text-xs font-bold px-3 py-1.5 rounded-xs uppercase tracking-wider"
                    >
                      Submit Evaluation Recommendation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUTHOR PORTAL VIEW */}
        {role === 'author' && (
          <div className="bg-white p-6 rounded-sm border border-slate-200 text-left space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold font-playfair text-[#081F45]">
                  Author Submissions Dashboard
                </h3>
                <p className="text-xs text-slate-500">Track peer review progress and resubmit revised manuscripts.</p>
              </div>
              <button
                onClick={onOpenSubmitModal}
                className="bg-[#C79A3D] text-[#081F45] font-bold text-xs px-4 py-2 rounded-xs uppercase tracking-wider"
              >
                + Submit New Manuscript
              </button>
            </div>

            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#081F45] font-bold">{sub.id}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                      sub.status === 'Accepted' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-playfair text-[#081F45]">{sub.title}</h4>
                  <p className="text-slate-500">Submitted on: {sub.submissionDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ASSIGN REVIEWERS (إعادة توجيه للمقيمين) */}
      {isAssignModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#081F45] max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  Peer Review Assignment
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Assign Accredited Reviewers to Manuscript
                </h3>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 bg-slate-50 p-3 rounded-xs border border-slate-200">
              <div><strong className="text-slate-700">Manuscript ID:</strong> {selectedSubmission.id}</div>
              <div><strong className="text-slate-700">Title:</strong> {selectedSubmission.title}</div>
              <div><strong className="text-slate-700">Scope:</strong> {selectedSubmission.scope}</div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#081F45] uppercase tracking-wider">
                Select Reviewer(s) from Board (اختر المقيمين):
              </label>

              <div className="max-h-56 overflow-y-auto space-y-2 border border-slate-200 p-2 rounded-xs bg-white">
                {ACRREDITED_REVIEWERS.map((rev) => {
                  const isChecked = selectedReviewerIds.includes(rev.id);
                  return (
                    <label 
                      key={rev.id}
                      className={`flex items-start gap-3 p-2.5 rounded-xs border cursor-pointer transition-colors ${
                        isChecked ? 'bg-purple-50 border-purple-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReviewerIds([...selectedReviewerIds, rev.id]);
                          } else {
                            setSelectedReviewerIds(selectedReviewerIds.filter(id => id !== rev.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#081F45] block">{rev.name}</span>
                        <span className="text-[11px] text-slate-600 block">{rev.institution}</span>
                        <span className="text-[10px] text-purple-800 font-semibold block mt-0.5">Specialty: {rev.specialty}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Due Date</label>
                <input
                  type="date"
                  value={reviewerDeadline}
                  onChange={(e) => setReviewerDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Peer Review Protocol</label>
                <div className="p-2 bg-slate-100 rounded-xs text-[11px] text-slate-600">
                  Double-Blind Peer Review (Authors & Reviewers Anonymized)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Secret Note to Reviewers (Optional)</label>
              <textarea
                rows={2}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Specific directions for methodology or clinical significance evaluation..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xs text-xs"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReviewers}
                className="px-5 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#184A87]"
              >
                Confirm Assignment ({selectedReviewerIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITORIAL DECISION & AUTHOR RESPONSE (الرد على الباحث) */}
      {isDecisionModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#C79A3D] max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  Editorial Decision & Author Notification
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Issue Decision & Send Formal Letter to Author
                </h3>
              </div>
              <button 
                onClick={() => setIsDecisionModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Decision Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-[#081F45] mb-2 uppercase tracking-wider">
                Select Editorial Action (حدد القرار):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDecisionType('Accept')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    decisionType === 'Accept' 
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs' 
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  ✅ قبول Accept
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Minor Revision')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    decisionType === 'Minor Revision' 
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs' 
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  🔄 تعديل طفيف Minor
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Major Revision')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    decisionType === 'Major Revision' 
                      ? 'bg-orange-600 text-white border-orange-700 shadow-2xs' 
                      : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  🔄 تعديل جوهري Major
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionType('Reject')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    decisionType === 'Reject' 
                      ? 'bg-rose-600 text-white border-rose-700 shadow-2xs' 
                      : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  ❌ رفض Reject
                </button>
              </div>
            </div>

            {/* Author Recipient */}
            <div className="bg-slate-50 p-3 rounded-xs border border-slate-200 text-xs space-y-1">
              <div><strong className="text-slate-700">Recipient Author:</strong> {selectedSubmission.correspondingAuthor}</div>
              <div><strong className="text-slate-700">Author Email:</strong> <span className="font-mono text-blue-800">{selectedSubmission.authorEmail}</span></div>
            </div>

            {/* Email Composer */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Formal Response Letter to Author</label>
                <textarea
                  rows={6}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xs text-xs font-sans leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Editorial Board Notes (Confidential)</label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record rationale for decision..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDecision}
                className="px-5 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#184A87] flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#C79A3D]" />
                <span>Save Decision & Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW MANUSCRIPT DETAILS */}
      {isViewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#081F45] max-w-3xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  {selectedSubmission.id}
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  {selectedSubmission.title}
                </h3>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xs border border-slate-200">
              <div><strong>Corresponding Author:</strong> {selectedSubmission.correspondingAuthor}</div>
              <div><strong>Email:</strong> {selectedSubmission.authorEmail}</div>
              <div><strong>Institution:</strong> {selectedSubmission.institution || 'Al-Habbobi Teaching Hospital'}</div>
              <div><strong>Submission Date:</strong> {selectedSubmission.submissionDate}</div>
              <div><strong>Article Type:</strong> {selectedSubmission.articleType}</div>
              <div><strong>Scope:</strong> {selectedSubmission.scope}</div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#081F45] uppercase tracking-wider mb-1">Abstract</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xs border border-slate-200 leading-relaxed">
                {selectedSubmission.abstract || 'No abstract text submitted.'}
              </p>
            </div>

            {selectedSubmission.keywords && selectedSubmission.keywords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#081F45] uppercase tracking-wider mb-1">Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSubmission.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-xs border border-slate-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Editorial Audit Logs */}
            {selectedSubmission.logs && selectedSubmission.logs.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#081F45] uppercase tracking-wider mb-1">Editorial Audit Trail & History</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                  {selectedSubmission.logs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-xs border border-slate-200 text-[11px]">
                      <div>
                        <span className="font-bold text-[#081F45]">{log.action}</span>
                        {log.notes && <span className="text-slate-500 block text-[10px]">{log.notes}</span>}
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        <div>{log.date}</div>
                        <div className="font-semibold text-purple-900">{log.actor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-bold uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT MANUSCRIPT (تعديل) */}
      {isEditModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-amber-500 max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-xs">
                  Edit Metadata
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Edit Manuscript Details ({selectedSubmission.id})
                </h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Manuscript Title</label>
                <input
                  type="text"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corresponding Author</label>
                  <input
                    type="text"
                    value={editFormData.correspondingAuthor || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, correspondingAuthor: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Email</label>
                  <input
                    type="email"
                    value={editFormData.authorEmail || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, authorEmail: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Article Type</label>
                  <select
                    value={editFormData.articleType || 'Original Research'}
                    onChange={(e) => setEditFormData({ ...editFormData, articleType: e.target.value as ArticleType })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs bg-white"
                  >
                    <option>Original Research</option>
                    <option>Systematic Review</option>
                    <option>Meta-Analysis</option>
                    <option>Case Report</option>
                    <option>Short Communication</option>
                    <option>Review Article</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Journal Scope</label>
                  <input
                    type="text"
                    value={editFormData.scope || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, scope: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Abstract Text</label>
                <textarea
                  rows={4}
                  value={editFormData.abstract || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, abstract: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-bold uppercase tracking-wider"
              >
                Save Manuscript Edits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW MANUSCRIPT (إضافة بحث جديد) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#C79A3D] max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  New Submission Entry
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Add New Research Manuscript (إضافة بحث جديد)
                </h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewManuscript} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Manuscript Title * (عنوان البحث)</label>
                <input
                  type="text"
                  required
                  value={newManuscript.title}
                  onChange={(e) => setNewManuscript({ ...newManuscript, title: e.target.value })}
                  placeholder="e.g., Diagnostic Molecular Profiling of Pathogens in Southern Iraq..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corresponding Author Name * (اسم الباحث)</label>
                  <input
                    type="text"
                    required
                    value={newManuscript.correspondingAuthor}
                    onChange={(e) => setNewManuscript({ ...newManuscript, correspondingAuthor: e.target.value })}
                    placeholder="Dr. Full Name"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Email Address * (بريد الباحث)</label>
                  <input
                    type="email"
                    required
                    value={newManuscript.authorEmail}
                    onChange={(e) => setNewManuscript({ ...newManuscript, authorEmail: e.target.value })}
                    placeholder="author@hospital.iq"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Institution (المؤسسة / المستشفى)</label>
                  <input
                    type="text"
                    value={newManuscript.institution}
                    onChange={(e) => setNewManuscript({ ...newManuscript, institution: e.target.value })}
                    placeholder="Al-Habbobi Teaching Hospital"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Article Type</label>
                  <select
                    value={newManuscript.articleType}
                    onChange={(e) => setNewManuscript({ ...newManuscript, articleType: e.target.value as ArticleType })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xs bg-white font-sans"
                  >
                    <option>Original Research</option>
                    <option>Systematic Review</option>
                    <option>Meta-Analysis</option>
                    <option>Case Report</option>
                    <option>Short Communication</option>
                    <option>Review Article</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scope Category</label>
                <select
                  value={newManuscript.scope}
                  onChange={(e) => setNewManuscript({ ...newManuscript, scope: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs bg-white font-sans"
                >
                  <option>Medical Microbiology & Virology</option>
                  <option>Pathology & Histopathology</option>
                  <option>Clinical Chemistry</option>
                  <option>Immunology & Serology</option>
                  <option>Hematology & Blood Banking</option>
                  <option>Public Health & Epidemiology</option>
                  <option>Clinical Medicine</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Abstract Text (ملخص البحث)</label>
                <textarea
                  rows={4}
                  value={newManuscript.abstract}
                  onChange={(e) => setNewManuscript({ ...newManuscript, abstract: e.target.value })}
                  placeholder="Enter abstract summary..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={newManuscript.keywords}
                  onChange={(e) => setNewManuscript({ ...newManuscript, keywords: e.target.value })}
                  placeholder="Microbiology, Real-time PCR, Biomarkers"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#184A87]"
                >
                  Add Manuscript to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE CONFIRMATION DIALOG (حذف البحث) */}
      {isDeleteConfirmOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-rose-600 max-w-md w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <h3 className="text-base font-bold font-playfair text-rose-950">
                  Confirm Delete Manuscript (حذف البحث)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  Are you sure you want to permanently delete submission <strong>{selectedSubmission.id}</strong> ("{selectedSubmission.title}") from the journal records?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmission}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xs text-xs font-bold uppercase tracking-wider"
              >
                Delete Manuscript
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
