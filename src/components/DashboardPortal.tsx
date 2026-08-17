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
  Database,
  LogOut
} from 'lucide-react';
import { SubmissionRecord, AssignedReviewer, ArticleType, UserAccount, ReviewerAttachment } from '../types';
import { INITIAL_ADMIN_SUBMISSIONS, ACRREDITED_REVIEWERS } from '../data/adminMockData';
import { MOCK_ARTICLES } from '../data/mockJournalData';
import { ALL_SYSTEM_USERS, REVIEWER_ACCOUNTS, ADMIN_ACCOUNT } from '../data/authAccounts';
import { updateSubmissionInDB } from '../db/localRealmDB';

interface DashboardPortalProps {
  onOpenSubmitModal: () => void;
  onOpenRealmDb?: () => void;
  submissions?: SubmissionRecord[];
  setSubmissions?: React.Dispatch<React.SetStateAction<SubmissionRecord[]>>;
  currentUser?: UserAccount;
  setCurrentUser?: (user: UserAccount) => void;
}

type StatusFilter = 'All' | 'Submitted' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected' | 'Published';

export const DashboardPortal: React.FC<DashboardPortalProps> = ({ 
  onOpenSubmitModal,
  onOpenRealmDb,
  submissions: externalSubmissions,
  setSubmissions: externalSetSubmissions,
  currentUser,
  setCurrentUser
}) => {
  const [role, setRole] = useState<'editor' | 'author' | 'reviewer'>(currentUser?.role || 'editor');

  React.useEffect(() => {
    if (currentUser?.role) {
      setRole(currentUser.role);
    }
  }, [currentUser]);

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

  // Reviewer Evaluation & Credentials Modals state
  const [isReviewerEvalModalOpen, setIsReviewerEvalModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

  const [evalRecommendation, setEvalRecommendation] = useState<'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'>('Accept');
  const [evalCommentsAuthor, setEvalCommentsAuthor] = useState('');
  const [evalCommentsEditor, setEvalCommentsEditor] = useState('');
  const [evalAttachedFile, setEvalAttachedFile] = useState<ReviewerAttachment | null>(null);

  // Open Reviewer Evaluation Modal
  const handleOpenReviewerEvalModal = (sub: SubmissionRecord) => {
    setSelectedSubmission(sub);
    const myRev = sub.assignedReviewers?.find(
      r => r.email === currentUser?.email || r.id === currentUser?.reviewerId
    );

    if (myRev) {
      setEvalRecommendation(myRev.recommendation || 'Accept');
      setEvalCommentsAuthor(myRev.commentsToAuthor || '');
      setEvalCommentsEditor(myRev.commentsToEditor || '');
      setEvalAttachedFile(myRev.attachedFile || null);
    } else {
      setEvalRecommendation('Accept');
      setEvalCommentsAuthor('');
      setEvalCommentsEditor('');
      setEvalAttachedFile(null);
    }
    setIsReviewerEvalModalOpen(true);
  };

  // Reviewer File Upload Handler
  const handleReviewerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setEvalAttachedFile({
        fileName: file.name,
        fileSize: sizeMb,
        fileType: file.type || 'application/octet-stream',
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileDataUrl: dataUrl
      });
      showToast(`📄 Evaluation report attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  // Save Reviewer Evaluation Action
  const handleSaveReviewerEvaluation = () => {
    if (!selectedSubmission) return;

    const reviewerName = currentUser?.name || 'Prof. Accredited Reviewer';
    const reviewerId = currentUser?.reviewerId || 'REV-101';
    const reviewerEmail = currentUser?.email || 'reviewer@imjb-iq.org';
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    let updatedAssignedReviewers: AssignedReviewer[] = (selectedSubmission.assignedReviewers || []).map(r => {
      if (r.id === reviewerId || r.email === reviewerEmail) {
        return {
          ...r,
          status: 'Completed',
          recommendation: evalRecommendation,
          commentsToAuthor: evalCommentsAuthor,
          commentsToEditor: evalCommentsEditor,
          attachedFile: evalAttachedFile || r.attachedFile,
          evaluationDate: todayStr
        };
      }
      return r;
    });

    const exists = updatedAssignedReviewers.some(r => r.id === reviewerId || r.email === reviewerEmail);
    if (!exists) {
      updatedAssignedReviewers.push({
        id: reviewerId,
        name: reviewerName,
        institution: currentUser?.institution || 'College of Medicine',
        email: reviewerEmail,
        specialty: currentUser?.specialty || 'Medical Sciences',
        status: 'Completed',
        recommendation: evalRecommendation,
        commentsToAuthor: evalCommentsAuthor,
        commentsToEditor: evalCommentsEditor,
        attachedFile: evalAttachedFile || undefined,
        evaluationDate: todayStr
      });
    }

    const updatedSubmission: SubmissionRecord = {
      ...selectedSubmission,
      assignedReviewers: updatedAssignedReviewers,
      logs: [
        ...(selectedSubmission.logs || []),
        {
          date: todayStr,
          action: `Submitted Formal Evaluation & File Recommendation (${evalRecommendation})`,
          actor: `Reviewer: ${reviewerName}`,
          notes: evalCommentsEditor ? `Confidential Editor Notes: ${evalCommentsEditor}` : 'Evaluation comments submitted.'
        }
      ]
    };

    setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? updatedSubmission : s));
    updateSubmissionInDB(selectedSubmission.id, updatedSubmission);

    setIsReviewerEvalModalOpen(false);
    showToast(`✅ Evaluation and recommendations submitted successfully for manuscript (${selectedSubmission.id})!`);
  };

  // Download Files Helper (Manuscript, Cover Letter, Title Page)
  const handleDownloadFile = (sub: SubmissionRecord, fileType: 'manuscript' | 'coverLetter' | 'titlePage' = 'manuscript') => {
    let fileName = sub.fileName || `Manuscript_${sub.id}_IMJB.pdf`;
    let docTitle = 'MANUSCRIPT SUBMISSION FILE - OFFICIAL DRAFT FOR PEER REVIEW';
    let fileTypeLabel = 'Main Manuscript File';

    if (fileType === 'coverLetter') {
      fileName = sub.coverLetterFileName || `Cover_Letter_${sub.id}_IMJB.docx`;
      docTitle = 'OFFICIAL COVER LETTER TO EDITOR-IN-CHIEF';
      fileTypeLabel = 'Cover Letter File';
    } else if (fileType === 'titlePage') {
      fileName = sub.titlePageFileName || `Title_Page_${sub.id}_IMJB.docx`;
      docTitle = 'MANUSCRIPT TITLE PAGE & AUTHOR AFFILIATIONS';
      fileTypeLabel = 'Title Page File';
    }

    let content = `====================================================================
IRAQI MEDICAL JOURNAL OF BABYLON (IMJB)
${docTitle}
====================================================================

Manuscript ID: ${sub.id}
Tracking Code: ${sub.trackingCode}
Submission Date: ${sub.submissionDate}
Article Type: ${sub.articleType}
Scope Category: ${sub.scope}

Title:
${sub.title}

`;

    if (fileType === 'coverLetter') {
      content += `TO: Editor-in-Chief, Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
FROM: ${sub.correspondingAuthor} (${sub.authorEmail})
INSTITUTION: ${sub.institution || 'University of Babylon / Medical Sciences'}

Dear Editor-in-Chief,

We are pleased to submit our research manuscript entitled "${sub.title}" for consideration for publication in the Iraqi Journal of Biomedical and Clinical Medicine.

We confirm that:
1. This manuscript represents original work and is not under consideration elsewhere.
2. All authors have reviewed and approved the final submitted draft.
3. Ethical approvals and IRB consent forms were obtained.

Sincerely,
${sub.correspondingAuthor}
Corresponding Author
`;
    } else if (fileType === 'titlePage') {
      content += `--------------------------------------------------------------------
AUTHOR DETAILS & INSTITUTIONAL AFFILIATIONS:
--------------------------------------------------------------------
Title: ${sub.title}

Corresponding Author:
Name: ${sub.correspondingAuthor}
Email: ${sub.authorEmail}
Institution: ${sub.institution || 'University of Babylon / Medical Sciences'}

Co-Authors:
1. ${sub.correspondingAuthor} (Department of Medical Sciences)
2. Co-Author 2 (Dept. of Clinical Pathology, Babylon Health Directorate)

Financial & Conflict of Interest Disclosure:
No commercial or financial conflicts of interest are declared.
`;
    } else {
      content += `Corresponding Author:
${sub.correspondingAuthor} (${sub.authorEmail})
Institution: ${sub.institution || 'University of Babylon / Medical Sciences'}

--------------------------------------------------------------------
ABSTRACT:
--------------------------------------------------------------------
${sub.abstract || 'No abstract text provided.'}

Keywords:
${(sub.keywords || ['Medical Sciences', 'Iraq', 'Clinical Research']).join(', ')}

--------------------------------------------------------------------
MANUSCRIPT FULL TEXT CONTENT DRAFT:
--------------------------------------------------------------------
1. INTRODUCTION:
This manuscript presents novel research findings within the scope of ${sub.scope}. 
The primary objective is to evaluate clinical outcomes and evidence-based diagnostic protocols in Iraqi healthcare institutions.

2. MATERIALS AND METHODS:
A structured cross-sectional / prospective clinical study was conducted at the affiliated medical centers.
Ethical approvals were obtained from the Institutional Review Board (IRB). Statistical analyses were performed using SPSS and R packages.

3. RESULTS & DISCUSSION:
Statistical analysis indicates significant clinical correlation across key parameters (p < 0.05).
Raw datasets and laboratory figure uploads are archived under tracking reference ${sub.trackingCode}.

4. CONCLUSION:
The research findings support updated diagnostic guidelines and provide foundational empirical evidence for clinical practice in Iraq.
`;
    }

    content += `
====================================================================
CONFIDENTIAL DOCUMENT - IMJB EDITORIAL MANAGEMENT SYSTEM
IMJB Journal Portal - https://imjb-iq.org
====================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.pdf') ? fileName.replace('.pdf', '_Draft.txt') : fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`📥 Downloading ${fileTypeLabel}: ${fileName}`);
  };

  const handleDownloadManuscript = (sub: SubmissionRecord) => {
    handleDownloadFile(sub, 'manuscript');
  };

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
      setEmailSubject(`IJBCM Acceptance Notice: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nWe are pleased to inform you that your manuscript titled "${sub.title}" has been formally ACCEPTED for publication in the Iraqi Journal of Biomedical and Clinical Medicine (IJBCM).\n\nYour manuscript will be assigned to Volume 4, Issue 2 (June 2026).\n\nBest regards,\nEditorial Board, IJBCM`);
    } else if (type === 'Minor Revision' || type === 'Major Revision') {
      setEmailSubject(`IJBCM Editorial Decision - ${type}: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nFollowing peer review evaluation of your manuscript "${sub.title}", the Editorial Board requests ${type.toUpperCase()} before final acceptance.\n\nPlease address the reviewer comments below and resubmit within 14 days.\n\nBest regards,\nEditorial Office, IJBCM`);
    } else {
      setEmailSubject(`IJBCM Editorial Decision - Rejection: ${sub.id}`);
      setEmailMessage(`Dear Dr. ${sub.correspondingAuthor},\n\nThank you for submitting your research manuscript "${sub.title}" to the Iraqi Journal of Biomedical and Clinical Medicine.\n\nAfter thorough editorial review, we regret to inform you that your manuscript cannot be accepted for publication at this time.\n\nWe wish you success in placing your work elsewhere.\n\nSincerely,\nEditor-in-Chief, IJBCM`);
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

  // List of accepted articles for Author Portal (Accepted submissions + Published articles)
  const acceptedSubmissionsList = submissions
    .filter(s => s.status === 'Accepted' || s.status === 'Published')
    .map(s => ({
      id: s.id,
      title: s.title,
      scheduledIssue: 'Vol. 4, Issue 2 (June 2026)',
      publicationDate: 'June 2026',
      authorName: s.correspondingAuthor,
      institution: s.institution || 'Al-Habbobi Teaching Hospital',
      email: s.authorEmail,
      articleType: s.articleType,
      scope: s.scope,
      status: s.status,
      statusLabel: s.status === 'Accepted' ? 'Accepted for Publication' : 'Published',
      abstract: s.abstract || ''
    }));

  const publishedArticlesList = MOCK_ARTICLES.map(art => ({
    id: art.id,
    title: art.title,
    scheduledIssue: `Vol. ${art.volume}, Issue ${art.issue} (${art.year})`,
    publicationDate: art.publicationDate,
    authorName: art.authors[0]?.name || 'Dr. Researcher',
    institution: art.authors[0]?.affiliation || 'Al-Habbobi Teaching Hospital',
    email: art.authors[0]?.email || 'author@imjb-iq.org',
    articleType: art.articleType,
    scope: art.scope,
    status: 'Published',
    statusLabel: 'Published',
    abstract: art.abstract
  }));

  const allAcceptedList = [...acceptedSubmissionsList, ...publishedArticlesList];

  // Author's private submissions matching their email
  const myPrivateSubmissions = submissions.filter(s => 
    currentUser?.email ? s.authorEmail.toLowerCase() === currentUser.email.toLowerCase() : false
  );

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
                <span className="text-[10px] font-bold text-slate-300 font-sans">
                  Editorial & Manuscript Submissions Portal
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
                title="Open Realm DB Inspector"
              >
                <Database className="w-4 h-4 text-[#C79A3D]" />
                <span>Realm DB Console</span>
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-bold text-xs px-3.5 py-2 rounded-xs flex items-center gap-1.5 uppercase tracking-wider transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manuscript</span>
            </button>
          </div>
        </div>

        {/* Role Switcher & Logged-in User Session Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-sm border border-slate-200 text-xs shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Portal View Mode:</span>
            
            {currentUser?.role === 'editor' && (
              <button
                onClick={() => setRole('editor')}
                className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                  role === 'editor'
                    ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🛡️ Editor Admin
              </button>
            )}

            {(currentUser?.role === 'editor' || currentUser?.role === 'reviewer') && (
              <button
                onClick={() => setRole('reviewer')}
                className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                  role === 'reviewer'
                    ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                👨‍🏫 Reviewer Queue
              </button>
            )}

            <button
              onClick={() => setRole('author')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all uppercase tracking-wider ${
                role === 'author'
                  ? 'bg-[#081F45] text-[#C79A3D] shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✍️ Author Portal
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 px-3 py-1.5 rounded-xs border border-slate-200 text-left text-[11px] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#081F45]" />
              <div>
                <span className="font-bold text-[#081F45] block">{currentUser?.name || 'Prof. Editor-in-Chief'}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{currentUser?.email || 'editor@imjb-iq.org'}</span>
              </div>
            </div>

            {currentUser?.role === 'editor' && (
              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs px-3 py-2 rounded-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                <span>Accounts Guide</span>
              </button>
            )}

            {setCurrentUser && (
              <button
                onClick={() => setCurrentUser(null as any)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs px-3 py-2 rounded-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-700" />
                <span>Sign Out</span>
              </button>
            )}
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
                      <span>New Submissions: {unassignedCount} newly submitted manuscript(s) awaiting initial screening & reviewer assignment</span>
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
                  <span>Show New Submissions ({unassignedCount})</span>
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
                <div className="text-[10px] text-slate-500 mt-0.5">Total Manuscripts</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Submitted')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-blue-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Submitted' ? 'ring-2 ring-blue-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">Unassigned</div>
                <div className="text-xl font-bold font-playfair text-blue-900 mt-0.5">{unassignedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">New / Screening</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Under Review')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-purple-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Under Review' ? 'ring-2 ring-purple-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Under Review</div>
                <div className="text-xl font-bold font-playfair text-purple-900 mt-0.5">{underReviewCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">In Peer Review</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Revision Required')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-amber-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Revision Required' ? 'ring-2 ring-amber-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Revisions</div>
                <div className="text-xl font-bold font-playfair text-amber-900 mt-0.5">{revisionCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pending Revisions</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Accepted')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Accepted' ? 'ring-2 ring-emerald-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Accepted</div>
                <div className="text-xl font-bold font-playfair text-emerald-900 mt-0.5">{acceptedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Accepted Papers</div>
              </div>

              <div 
                onClick={() => setStatusFilter('Rejected')}
                className={`p-3.5 bg-white rounded-sm border-l-4 border-l-rose-600 border-t border-r border-b border-slate-200 shadow-2xs cursor-pointer transition-all hover:bg-slate-50 ${statusFilter === 'Rejected' ? 'ring-2 ring-rose-600' : ''}`}
              >
                <div className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Rejected</div>
                <div className="text-xl font-bold font-playfair text-rose-900 mt-0.5">{rejectedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rejected Papers</div>
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
                    {st === 'All' ? 'All Submissions' : st}
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
                      <th className="p-3 border-b border-[#184A87]">Status</th>
                      <th className="p-3 border-b border-[#184A87]">Assigned Reviewers</th>
                      <th className="p-3 border-b border-[#184A87] text-right">Admin Actions</th>
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
                              {sub.status === 'Submitted' ? 'Submitted' : sub.status}
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
                              {/* Download Manuscript Button */}
                              <button
                                onClick={() => handleDownloadManuscript(sub)}
                                title="Download Manuscript File"
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-700 text-emerald-900 hover:text-white border border-emerald-300 rounded-xs transition-colors text-[10px] font-bold flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3 rotate-180" />
                                <span>Download</span>
                              </button>

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
                                title="Assign to Peer Reviewers"
                                className="px-2 py-1 bg-purple-50 hover:bg-purple-700 text-purple-900 hover:text-white border border-purple-200 rounded-xs transition-colors text-[10px] font-bold flex items-center gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Assign Reviewer</span>
                              </button>

                              {/* Decision & Author Email */}
                              <div className="relative group inline-block">
                                <button
                                  onClick={() => handleOpenDecisionModal(sub, 'Accept')}
                                  title="Issue Editorial Decision"
                                  className="px-2 py-1 bg-[#081F45] text-[#C79A3D] hover:bg-[#184A87] rounded-xs transition-colors text-[10px] font-bold flex items-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Editorial Decision</span>
                                </button>
                              </div>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditModal(sub)}
                                title="Edit Manuscript Details"
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
                                title="Delete Manuscript"
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
                                [Accept]
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                onClick={() => handleOpenDecisionModal(sub, 'Minor Revision')}
                                className="text-amber-700 hover:underline font-bold"
                              >
                                [Revision]
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                onClick={() => handleOpenDecisionModal(sub, 'Reject')}
                                className="text-rose-700 hover:underline font-bold"
                              >
                                [Reject]
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
            <div className="bg-[#081F45] text-white p-5 rounded-sm border-l-4 border-l-[#C79A3D] space-y-2 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#C79A3D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C79A3D]">
                    Double-Blind Peer Reviewer Workspace
                  </span>
                </div>
                <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-xs font-mono">
                  Reviewer ID: {currentUser?.reviewerId || 'REV-101'}
                </span>
              </div>
              <h2 className="text-lg font-bold font-playfair text-white">
                Welcome, Dr. {currentUser?.name || 'Accredited Peer Reviewer'}
              </h2>
              <p className="text-xs text-slate-300">
                Specialty: <strong className="text-white">{currentUser?.specialty || 'Medical Sciences'}</strong> • Institution: <strong className="text-white">{currentUser?.institution || 'University of Baghdad - College of Medicine'}</strong>
              </p>
              <div className="text-[11px] text-amber-200 bg-black/20 p-2.5 rounded-xs border border-white/10 mt-2">
                📌 <strong>Reviewer Privileges:</strong> The system provides full access to preview and evaluate manuscripts assigned to you, download the author's manuscript file for review, and submit formal evaluation reports and recommendations to the editorial board.
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold font-playfair text-[#081F45] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C79A3D]" />
                <span>Assigned Manuscripts for Peer Review</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Total Assigned: {submissions.filter(s => s.status === 'Under Review').length}
              </span>
            </div>

            <div className="space-y-4">
              {submissions.filter(s => s.status === 'Under Review').map((sub) => {
                const myAssigned = sub.assignedReviewers?.find(
                  r => r.email === currentUser?.email || r.id === currentUser?.reviewerId
                );

                const isDone = myAssigned?.status === 'Completed';

                return (
                  <div key={sub.id} className="bg-slate-50 border border-slate-200 p-5 rounded-sm space-y-4 shadow-2xs hover:border-[#081F45] transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#081F45] text-white px-2 py-0.5 rounded-xs font-bold text-[11px]">{sub.id}</span>
                        <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-xs text-[10px]">
                          Peer Review: Double-Blind Review
                        </span>
                      </div>
                      
                      {isDone ? (
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-xs text-xs flex items-center gap-1 border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Evaluation Submitted ({myAssigned?.recommendation})</span>
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-xs text-xs flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold font-playfair text-[#081F45]">{sub.title}</h4>
                      <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-3">
                        <span><strong>Scope:</strong> {sub.scope}</span>
                        <span>•</span>
                        <span><strong>Article Type:</strong> {sub.articleType}</span>
                        <span>•</span>
                        <span><strong>Assigned Date:</strong> {sub.submissionDate}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3.5 rounded-xs border border-slate-200 text-xs text-slate-700 space-y-1">
                      <strong className="text-[#081F45] block font-sans">Abstract Preview:</strong>
                      <p className="leading-relaxed text-slate-600">{sub.abstract}</p>
                    </div>

                    {/* Display previous reviewer response if completed */}
                    {isDone && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xs text-xs text-emerald-950 space-y-2">
                        <div className="font-bold flex items-center justify-between border-b border-emerald-200 pb-1.5">
                          <span>Your Submitted Evaluation Summary:</span>
                          <span className="text-[10px] text-emerald-700 font-mono">Evaluation Date: {myAssigned?.evaluationDate}</span>
                        </div>
                        {myAssigned?.commentsToAuthor && (
                          <div>
                            <strong className="text-emerald-900">Comments to Author:</strong> "{myAssigned.commentsToAuthor}"
                          </div>
                        )}
                        {myAssigned?.commentsToEditor && (
                          <div>
                            <strong className="text-emerald-900">Confidential Comments to Editor:</strong> "{myAssigned.commentsToEditor}"
                          </div>
                        )}
                        {myAssigned?.attachedFile && (
                          <div className="bg-white p-2 rounded-xs border border-emerald-300 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-700" />
                              <span className="font-bold text-slate-800">{myAssigned.attachedFile.fileName}</span>
                              <span className="text-slate-500 font-mono text-[10px]">({myAssigned.attachedFile.fileSize})</span>
                            </div>
                            <span className="text-emerald-800 font-bold text-[10px]">✓ Evaluation File Attached</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        {/* Download Manuscript Button */}
                        <button
                          onClick={() => handleDownloadManuscript(sub)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1.5 shadow-xs transition-colors"
                          title="Download original manuscript file"
                        >
                          <Upload className="w-4 h-4 rotate-180" />
                          <span>Download Manuscript</span>
                        </button>

                        <button 
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setIsViewModalOpen(true);
                          }}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => handleOpenReviewerEvalModal(sub)}
                        className="bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] text-xs font-bold px-4 py-2 rounded-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isDone ? 'Edit Evaluation Report' : 'Submit Evaluation & Report'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {role === 'author' && (
          <div className="space-y-6">
            {/* Top Privacy & Security Notice */}
            <div className="bg-[#081F45] text-white p-5 rounded-sm border-l-4 border-l-[#C79A3D] space-y-3 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C79A3D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C79A3D]">
                    Iraqi Journal of Biomedical and Clinical Medicine (IJBCM) • Author Portal
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xs font-extrabold border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🔒 Privacy & Intellectual Confidentiality Guarded</span>
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold font-playfair text-white">
                  Welcome, Dr. {currentUser?.name || 'Researcher'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  To protect intellectual property, all un-published manuscripts under review belonging to other authors are kept strictly confidential and accessible only by the Editor-in-Chief. This portal allows you to view **Accepted Manuscripts scheduled for publication**, as well as track your own submitted manuscripts.
                </p>
              </div>
            </div>

            {/* SECTION 1: ACCEPTED ARTICLES FOR PUBLICATION */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 text-left space-y-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold font-playfair text-[#081F45]">
                      Accepted Manuscripts Scheduled for Publication
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accepted Manuscripts for Publication • Scheduled Issue Numbers & Titles
                  </p>
                </div>

                <button
                  onClick={onOpenSubmitModal}
                  className="bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-extrabold text-xs px-4 py-2 rounded-xs uppercase tracking-wider shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Manuscript</span>
                </button>
              </div>

              {/* Table of Accepted Articles */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#081F45] text-[#C79A3D] font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3 border-b border-[#184A87]">Scheduled Issue & Vol</th>
                      <th className="p-3 border-b border-[#184A87]">Accepted Article Title</th>
                      <th className="p-3 border-b border-[#184A87]">Article Type & Scope</th>
                      <th className="p-3 border-b border-[#184A87]">Status</th>
                      <th className="p-3 border-b border-[#184A87] text-right">View Abstract</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {allAcceptedList.map((art, idx) => (
                      <tr key={art.id || idx} className="hover:bg-amber-50/50 transition-colors">
                        {/* Issue & Volume */}
                        <td className="p-3 align-top font-mono whitespace-nowrap">
                          <span className="font-extrabold text-[#081F45] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-xs text-[11px] block text-center border border-amber-300">
                            {art.scheduledIssue}
                          </span>
                          <span className="text-[10px] text-slate-500 block text-center mt-1">
                            Pub Date: {art.publicationDate}
                          </span>
                        </td>

                        {/* Article Title & Authors */}
                        <td className="p-3 align-top max-w-md">
                          <h4 className="font-bold font-playfair text-[#081F45] text-xs leading-snug">
                            {art.title}
                          </h4>
                          <div className="mt-1.5 text-[11px] text-slate-600 flex items-center gap-2">
                            <strong className="text-slate-800">{art.authorName}</strong>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 text-[10px]">{art.institution}</span>
                          </div>
                        </td>

                        {/* Type & Scope */}
                        <td className="p-3 align-top text-[11px]">
                          <span className="font-bold text-slate-700 block">{art.articleType}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{art.scope}</span>
                        </td>

                        {/* Status */}
                        <td className="p-3 align-top">
                          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-xs tracking-wider border ${
                            art.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}>
                            {art.statusLabel || 'Accepted for Publication'}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="p-3 align-top text-right">
                          <button
                            onClick={() => {
                              setSelectedSubmission({
                                id: art.id,
                                trackingCode: art.id,
                                title: art.title,
                                articleType: art.articleType as any,
                                scope: art.scope,
                                correspondingAuthor: art.authorName,
                                authorEmail: art.email || 'author@imjb-iq.org',
                                institution: art.institution,
                                submissionDate: art.publicationDate,
                                status: 'Accepted',
                                abstract: art.abstract
                              });
                              setIsViewModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-[#081F45] text-[#C79A3D] hover:bg-[#184A87] rounded-xs text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Abstract</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 2: MY PRIVATE SUBMISSIONS */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 text-left space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#081F45]" />
                  <h3 className="text-base font-bold font-playfair text-[#081F45]">
                    Track My Submitted Manuscripts
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  Account Email: {currentUser?.email || 'author@imjb-iq.org'}
                </span>
              </div>

              {myPrivateSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {myPrivateSubmissions.map((sub) => (
                    <div key={sub.id} className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2 text-xs hover:border-[#081F45] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#081F45] font-bold bg-white px-2 py-0.5 rounded-xs border">{sub.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Tracking Code: {sub.trackingCode}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-xs border ${
                          sub.status === 'Accepted' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-blue-100 text-blue-900 border-blue-300'
                        }`}>
                          {sub.status === 'Submitted' ? 'Submitted' : sub.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-playfair text-[#081F45]">{sub.title}</h4>
                      <div className="flex flex-wrap items-center justify-between text-slate-500 pt-1 text-[11px]">
                        <span>Submitted Date: {sub.submissionDate}</span>
                        <span>Article Type: {sub.articleType} ({sub.scope})</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-300 p-6 rounded-sm text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#081F45]">No private submissions found for this account</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You can click "Submit Manuscript" to submit your medical research paper, or track your manuscript by ID.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={onOpenSubmitModal}
                      className="bg-[#C79A3D] text-[#081F45] font-bold text-xs px-4 py-2 rounded-xs uppercase tracking-wider"
                    >
                      + Submit Manuscript Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ASSIGN REVIEWERS */}
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
                Select Reviewer(s) from Board:
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

      {/* MODAL 2: EDITORIAL DECISION & AUTHOR RESPONSE */}
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
                Select Editorial Action:
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
                  ✅ Accept
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
                  🔄 Minor Revision
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
                  🔄 Major Revision
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
                  ❌ Reject
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
              <h4 className="text-xs font-bold text-[#081F45] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#C79A3D]" />
                <span>Abstract Preview</span>
              </h4>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xs border border-slate-200 leading-relaxed font-sans shadow-2xs">
                {selectedSubmission.abstract || 'No abstract available for this manuscript.'}
              </p>
            </div>

            {/* Keywords if available */}
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

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 bg-[#081F45] text-[#C79A3D] hover:bg-[#184A87] rounded-xs text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT MANUSCRIPT */}
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

      {/* MODAL 5: ADD NEW MANUSCRIPT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#C79A3D] max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  New Submission Entry
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Add New Research Manuscript
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
                <label className="block font-bold text-slate-700 mb-1">Manuscript Title *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Corresponding Author Name *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Author Email Address *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Author Institution</label>
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
                <label className="block font-bold text-slate-700 mb-1">Abstract Text</label>
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

      {/* MODAL 6: DELETE CONFIRMATION DIALOG */}
      {isDeleteConfirmOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-rose-600 max-w-md w-full p-6 text-left space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>
                <h3 className="text-base font-bold font-playfair text-rose-950">
                  Confirm Delete Manuscript
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

      {/* MODAL 7: REVIEWER EVALUATION & FILE UPLOAD MODAL */}
      {isReviewerEvalModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-[#081F45] max-w-2xl w-full p-6 text-left space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded-xs">
                  Reviewer Evaluation & File Upload Portal
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Submit Evaluation & Recommendation ({selectedSubmission.id})
                </h3>
              </div>
              <button 
                onClick={() => setIsReviewerEvalModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xs border border-slate-200 text-xs space-y-1">
              <div><strong className="text-[#081F45]">Manuscript Title:</strong> {selectedSubmission.title}</div>
              <div><strong className="text-slate-700">Reviewer:</strong> {currentUser?.name} ({currentUser?.specialty})</div>
            </div>

            {/* Formal Recommendation */}
            <div>
              <label className="block text-xs font-bold text-[#081F45] mb-2 uppercase tracking-wider">
                Formal Recommendation:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEvalRecommendation('Accept')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    evalRecommendation === 'Accept' 
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs' 
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  ✅ Accept
                </button>

                <button
                  type="button"
                  onClick={() => setEvalRecommendation('Minor Revision')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    evalRecommendation === 'Minor Revision' 
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs' 
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  🔄 Minor Revision
                </button>

                <button
                  type="button"
                  onClick={() => setEvalRecommendation('Major Revision')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    evalRecommendation === 'Major Revision' 
                      ? 'bg-orange-600 text-white border-orange-700 shadow-2xs' 
                      : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  🔄 Major Revision
                </button>

                <button
                  type="button"
                  onClick={() => setEvalRecommendation('Reject')}
                  className={`p-2.5 rounded-xs font-bold text-center border transition-all ${
                    evalRecommendation === 'Reject' 
                      ? 'bg-rose-600 text-white border-rose-700 shadow-2xs' 
                      : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  ❌ Reject
                </button>
              </div>
            </div>

            {/* Detailed Comments to Author */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Comments to Author:
              </label>
              <textarea
                rows={4}
                value={evalCommentsAuthor}
                onChange={(e) => setEvalCommentsAuthor(e.target.value)}
                placeholder="Enter detailed feedback and corrections for the author..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xs text-xs font-sans"
              ></textarea>
            </div>

            {/* Confidential Comments to Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confidential Notes to Editor-in-Chief:
              </label>
              <textarea
                rows={2}
                value={evalCommentsEditor}
                onChange={(e) => setEvalCommentsEditor(e.target.value)}
                placeholder="Enter confidential notes regarding methodology or editorial recommendations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xs text-xs font-sans bg-slate-50"
              ></textarea>
            </div>

            {/* Upload Evaluation File */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#081F45] uppercase tracking-wider">
                Attach Evaluation Report (PDF / Word / Text):
              </label>
              
              <div className="border-2 border-dashed border-slate-300 hover:border-[#081F45] p-4 rounded-xs text-center bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleReviewerFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                />
                <Upload className="w-6 h-6 text-[#081F45] mx-auto mb-1" />
                <div className="text-xs font-bold text-[#081F45]">
                  Click or drag evaluation report file here
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Supports Word (.docx), PDF (.pdf), or Text (.txt)
                </div>
              </div>

              {evalAttachedFile && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xs flex items-center justify-between text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold block">{evalAttachedFile.fileName}</span>
                      <span className="text-[10px] text-emerald-700 font-mono">{evalAttachedFile.fileSize} • Uploaded: {evalAttachedFile.uploadedAt}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEvalAttachedFile(null)}
                    className="text-rose-700 hover:underline text-[10px] font-bold"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsReviewerEvalModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xs text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReviewerEvaluation}
                className="px-6 py-2 bg-[#081F45] text-[#C79A3D] rounded-xs text-xs font-extrabold uppercase tracking-wider hover:bg-[#184A87] shadow-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Evaluation & Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: USERS & REVIEWERS CREDENTIALS DIRECTORY MODAL */}
      {isCredentialsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border-t-4 border-t-purple-800 max-w-3xl w-full p-6 text-left space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-1 rounded-xs">
                  System Authentication Directory
                </span>
                <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">
                  Editor-in-Chief & Reviewers Accounts Directory
                </h3>
              </div>
              <button 
                onClick={() => setIsCredentialsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-xs text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Credentials */}
            <div className="bg-gradient-to-r from-[#081F45] to-[#184A87] text-white p-4 rounded-sm border-l-4 border-l-[#C79A3D] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C79A3D] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Editor Admin Account
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-xs font-mono">Role: Editor Admin</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded-xs border border-white/10 text-xs font-mono space-y-1">
                <div><strong>Email:</strong> editor@imjb-iq.org (or <strong>Username:</strong> admin)</div>
                <div><strong>Password:</strong> admin123</div>
              </div>
              <button
                onClick={() => {
                  if (setCurrentUser) setCurrentUser(ADMIN_ACCOUNT);
                  setRole('editor');
                  setIsCredentialsModalOpen(false);
                  showToast('✅ Switched to Editor Admin Account');
                }}
                className="w-full py-2 bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-extrabold text-xs rounded-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Switch to Admin Account</span>
              </button>
            </div>

            {/* Reviewers Credentials Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#081F45] uppercase tracking-wider">
                Accredited Reviewers Accounts ({REVIEWER_ACCOUNTS.length} Reviewers):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REVIEWER_ACCOUNTS.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xs space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-[#081F45]">{rev.name}</div>
                        <div className="text-[10px] text-purple-800 font-semibold">{rev.specialty}</div>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {rev.reviewerId}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-xs border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5">
                      <div><strong className="text-slate-500">Username/Email:</strong> {rev.email}</div>
                      <div><strong className="text-slate-500">Password:</strong> <span className="text-emerald-700 font-bold">{rev.password}</span></div>
                    </div>

                    <button
                      onClick={() => {
                        if (setCurrentUser) setCurrentUser(rev);
                        setRole('reviewer');
                        setIsCredentialsModalOpen(false);
                        showToast(`✅ Switched to Reviewer: ${rev.name}`);
                      }}
                      className="w-full py-1.5 bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-bold text-xs rounded-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Login as Reviewer</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsCredentialsModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 rounded-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
