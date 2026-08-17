import React, { useState, useEffect } from 'react';
import { X, Send, Upload, CheckCircle2, AlertCircle, FileText, UserCheck, ShieldCheck, ArrowRight, ArrowLeft, Mail, Search, LogIn } from 'lucide-react';
import { ArticleType, SubmissionRecord, UserAccount } from '../types';

interface SubmitManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newSubmission: SubmissionRecord) => void;
  onOpenEmailReceipt?: (sub: SubmissionRecord) => void;
  onOpenTrackStatus?: (query: string) => void;
  currentUser?: UserAccount | null;
  onNavigateToAuth?: () => void;
}

export const SubmitManuscriptModal: React.FC<SubmitManuscriptModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitSuccess,
  onOpenEmailReceipt,
  onOpenTrackStatus,
  currentUser,
  onNavigateToAuth
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    articleType: 'Original Research' as ArticleType,
    scope: 'Medical Microbiology & Virology',
    title: '',
    abstract: '',
    keywords: '',
    authorName: '',
    authorEmail: '',
    authorInstitution: 'Al-Habbobi Teaching Hospital',
    authorOrcid: '',
    fileName: '',
    coverLetterFileName: '',
    titlePageFileName: '',
    agreedEthics: false,
    agreedOpenAccess: false,
    agreedOriginality: false
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        authorName: currentUser.name || prev.authorName,
        authorEmail: currentUser.email || prev.authorEmail,
        authorInstitution: currentUser.institution || prev.authorInstitution
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleManuscriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, fileName: e.target.files[0].name }));
    }
  };

  const handleCoverLetterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, coverLetterFileName: e.target.files[0].name }));
    }
  };

  const handleTitlePageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, titlePageFileName: e.target.files[0].name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomIdNum = Math.floor(100000 + Math.random() * 900000);
    const trackingCodeNum = Math.floor(10000 + Math.random() * 90000);
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newRecord: SubmissionRecord = {
      id: `IMJB-2026-SUB-${randomIdNum}`,
      trackingCode: `TRK-${trackingCodeNum}`,
      title: formData.title || 'Untitled Biomedical Manuscript',
      articleType: formData.articleType,
      scope: formData.scope,
      correspondingAuthor: formData.authorName || 'Dr. Submitting Author',
      authorEmail: formData.authorEmail || 'author@hospital.iq',
      institution: formData.authorInstitution || 'Al-Habbobi Teaching Hospital',
      submissionDate: todayStr,
      status: 'Submitted',
      fileName: formData.fileName || 'Main_Manuscript.docx',
      coverLetterFileName: formData.coverLetterFileName || 'Cover_Letter.docx',
      titlePageFileName: formData.titlePageFileName || 'Title_Page.docx',
      abstract: formData.abstract || 'Structured abstract submitted by corresponding author.',
      keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [formData.scope, 'IMJB'],
      assignedReviewers: [],
      logs: [
        {
          date: todayStr,
          action: 'Manuscript, Cover Letter & Title Page Submitted',
          actor: formData.authorName || 'Author'
        }
      ]
    };

    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
    } catch (err) {
      console.warn('API sync fallback to local state:', err);
    }

    if (onSubmitSuccess) {
      onSubmitSuccess(newRecord);
    }

    setSubmissionResult(newRecord);
    setStep(4);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setStep(1);
    setSubmissionResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-left flex flex-col">
        {/* Header */}
        <div className="bg-[#081F45] text-white p-6 rounded-t-2xl flex items-center justify-between border-b border-[#184A87]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A3D] bg-white/10 px-2.5 py-0.5 rounded">
              Open Journal Systems (OJS 3.4) Portal
            </span>
            <h2 className="text-xl font-bold font-playfair text-white mt-1">
              Submit Manuscript to IMJB
            </h2>
            <p className="text-xs text-slate-300">
              Department of Medical Laboratories • Al-Habbobi Teaching Hospital
            </p>
          </div>
          <button
            onClick={resetForm}
            className="text-slate-400 hover:text-white p-1 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Wizard Stepper Header */}
        {step < 4 && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className={step === 1 ? 'text-[#081F45] font-bold' : ''}>1. Scope & Type</span>
            <span className="text-slate-300">→</span>
            <span className={step === 2 ? 'text-[#081F45] font-bold' : ''}>2. Author Details</span>
            <span className="text-slate-300">→</span>
            <span className={step === 3 ? 'text-[#081F45] font-bold' : ''}>3. Manuscript File</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {!currentUser ? (
            <div className="py-8 px-4 text-center space-y-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-16 h-16 bg-amber-100 text-[#081F45] rounded-full flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
                <ShieldCheck className="w-8 h-8 text-[#081F45]" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold font-playfair text-[#081F45]">
                  حساب باحث مطلوب أولاً / Account Registration Required
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  يرجى إنشاء حساب جديد أو تسجيل الدخول باسم المستخدم وكلمة المرور للتمكن من تقديم ورفع بحثك إلى المجلة وتتبعه.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To maintain academic accountability and track your manuscript submission, authors must be logged into an IMJB user account.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToAuth) onNavigateToAuth();
                  }}
                  className="bg-[#081F45] hover:bg-[#184A87] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md flex items-center gap-2 shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#C79A3D]" />
                  <span>Register / Sign In Now • تسجيل الدخول</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#081F45] font-playfair">
                Step 1: Select Article Classification
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article Type *
                </label>
                <select
                  value={formData.articleType}
                  onChange={(e) => setFormData({ ...formData, articleType: e.target.value as ArticleType })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#081F45]"
                >
                  <option value="Original Research">Original Research Paper</option>
                  <option value="Systematic Review">Systematic Review & Meta-Analysis</option>
                  <option value="Case Report">Clinical Case Report</option>
                  <option value="Short Communication">Short Communication</option>
                  <option value="Review Article">Comprehensive Review Article</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Journal Scope Category *
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#081F45]"
                >
                  <option value="1. Clinical Medicine">1. Clinical Medicine</option>
                  <option value="2. Biomedical and Laboratory Sciences">2. Biomedical and Laboratory Sciences</option>
                  <option value="3. Medical Physics, Biophysics, and Medical Imaging">3. Medical Physics, Biophysics, and Medical Imaging</option>
                  <option value="4. Pharmacology and Pharmaceutical Sciences">4. Pharmacology and Pharmaceutical Sciences</option>
                  <option value="5. Dentistry and Oral Health">5. Dentistry and Oral Health</option>
                  <option value="6. Health Sciences and Medical Technology">6. Health Sciences and Medical Technology</option>
                  <option value="Biomedical & Laboratory Sciences">Biomedical & Laboratory Sciences</option>
                  <option value="Medical Microbiology & Virology">Medical Microbiology & Virology</option>
                  <option value="Cancer Biology & Oncology">Cancer Biology & Oncology</option>
                  <option value="Hematology & Blood Banking">Hematology & Blood Banking</option>
                  <option value="Pathology & Histopathology">Pathology & Histopathology</option>
                  <option value="Clinical Chemistry">Clinical Chemistry</option>
                  <option value="Molecular Diagnostics (PCR/ELISA)">Molecular Diagnostics (PCR/ELISA)</option>
                  <option value="Immunology & Serology">Immunology & Serology</option>
                  <option value="Artificial Intelligence in Medicine">Artificial Intelligence in Medicine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Molecular Detection of Beta-Lactamase Resistance Genes in Clinical Isolates..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#081F45]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title}
                  className="bg-[#081F45] hover:bg-[#184A87] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <span>Next: Author Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#081F45] font-playfair">
                Step 2: Corresponding Author Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Academic Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ahmed Hassan Al-Rikabi"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="author@hospital.iq"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Affiliation *</label>
                  <input
                    type="text"
                    placeholder="Department of Medical Laboratories, Al-Habbobi Teaching Hospital"
                    value={formData.authorInstitution}
                    onChange={(e) => setFormData({ ...formData, authorInstitution: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ORCID iD (Optional)</label>
                  <input
                    type="text"
                    placeholder="0000-0002-XXXX-XXXX"
                    value={formData.authorOrcid}
                    onChange={(e) => setFormData({ ...formData, authorOrcid: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Abstract (Max 300 words)</label>
                <textarea
                  rows={4}
                  placeholder="Structured abstract including Background, Methods, Results, and Conclusions..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.authorName || !formData.authorEmail}
                  className="bg-[#081F45] hover:bg-[#184A87] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <span>Next: File & Ethics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#081F45] font-playfair">
                  Step 3: Upload Submission Files & Ethical Declarations
                </h3>
                <span className="text-xs text-[#081F45] font-bold bg-[#C79A3D]/20 px-2.5 py-1 rounded-xs">
                  Attach the 3 Required Documents
                </span>
              </div>

              {/* 3 Upload Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Main Manuscript File */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  formData.fileName ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}>
                  <FileText className={`w-7 h-7 mx-auto mb-1.5 ${formData.fileName ? 'text-emerald-600' : 'text-[#081F45]'}`} />
                  <div className="text-xs font-bold text-slate-800">
                    Main Manuscript File
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2">
                    (Main Manuscript - Double Blind)
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-white/80 p-1.5 rounded border border-slate-200 truncate mb-2">
                    {formData.fileName ? `✔️ ${formData.fileName}` : 'No file selected yet'}
                  </div>
                  <input
                    type="file"
                    accept=".docx,.pdf,.doc"
                    onChange={handleManuscriptFileChange}
                    className="hidden"
                    id="manuscript-file-input"
                  />
                  <label
                    htmlFor="manuscript-file-input"
                    className="inline-block bg-[#081F45] hover:bg-[#184A87] text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {formData.fileName ? 'Change File' : 'Select Manuscript File'}
                  </label>
                </div>

                {/* 2. Cover Letter File */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  formData.coverLetterFileName ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}>
                  <Upload className={`w-7 h-7 mx-auto mb-1.5 ${formData.coverLetterFileName ? 'text-emerald-600' : 'text-[#081F45]'}`} />
                  <div className="text-xs font-bold text-slate-800">
                    Cover Letter File
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2">
                    (Cover Letter Document)
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-white/80 p-1.5 rounded border border-slate-200 truncate mb-2">
                    {formData.coverLetterFileName ? `✔️ ${formData.coverLetterFileName}` : 'No file selected yet'}
                  </div>
                  <input
                    type="file"
                    accept=".docx,.pdf,.doc"
                    onChange={handleCoverLetterFileChange}
                    className="hidden"
                    id="cover-letter-file-input"
                  />
                  <label
                    htmlFor="cover-letter-file-input"
                    className="inline-block bg-[#081F45] hover:bg-[#184A87] text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {formData.coverLetterFileName ? 'Change File' : 'Select Cover Letter'}
                  </label>
                </div>

                {/* 3. Title Page File */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  formData.titlePageFileName ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}>
                  <UserCheck className={`w-7 h-7 mx-auto mb-1.5 ${formData.titlePageFileName ? 'text-emerald-600' : 'text-[#081F45]'}`} />
                  <div className="text-xs font-bold text-slate-800">
                    Title Page File
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2">
                    (Title Page with Authors)
                  </div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-white/80 p-1.5 rounded border border-slate-200 truncate mb-2">
                    {formData.titlePageFileName ? `✔️ ${formData.titlePageFileName}` : 'No file selected yet'}
                  </div>
                  <input
                    type="file"
                    accept=".docx,.pdf,.doc"
                    onChange={handleTitlePageFileChange}
                    className="hidden"
                    id="title-page-file-input"
                  />
                  <label
                    htmlFor="title-page-file-input"
                    className="inline-block bg-[#081F45] hover:bg-[#184A87] text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {formData.titlePageFileName ? 'Change File' : 'Select Title Page'}
                  </label>
                </div>
              </div>

              {/* Ethics Checkboxes */}
              <div className="space-y-2 pt-2 text-xs font-inter text-slate-700">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedOriginality}
                    onChange={(e) => setFormData({ ...formData, agreedOriginality: e.target.checked })}
                    className="mt-0.5 rounded text-[#081F45]"
                  />
                  <span>I confirm that this manuscript is original, has not been published previously, and is not currently under consideration by any other journal.</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedEthics}
                    onChange={(e) => setFormData({ ...formData, agreedEthics: e.target.checked })}
                    className="mt-0.5 rounded text-[#081F45]"
                  />
                  <span>I confirm compliance with COPE ethical guidelines, patient informed consent, and IRB institutional review approval where applicable.</span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedOpenAccess}
                    onChange={(e) => setFormData({ ...formData, agreedOpenAccess: e.target.checked })}
                    className="mt-0.5 rounded text-[#081F45]"
                  />
                  <span>I agree to publish under Creative Commons Attribution 4.0 International (CC BY 4.0) open-access licensing upon final acceptance.</span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!formData.agreedOriginality || !formData.agreedEthics || isSubmitting}
                  className="bg-[#C79A3D] hover:bg-amber-400 disabled:opacity-50 text-[#081F45] font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <span>Submitting to OJS...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Final Manuscript</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 4 && submissionResult && (
            <div className="text-center py-4 space-y-4 text-left dir-ltr">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-1 text-center">
                <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45]">
                  Manuscript Submission Successfully Received!
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto">
                  Your manuscript documents have been logged in the Editorial Board system for the <strong>Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</strong>. An official acknowledgment receipt has been sent to your registered email.
                </p>
              </div>

              {/* Submitted Details Receipt Card */}
              <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl max-w-lg mx-auto text-left space-y-2 text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Journal Name:</span>
                  <span className="font-bold text-[#081F45]">Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Manuscript ID:</span>
                  <div className="text-sm font-bold font-mono text-[#081F45] bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {submissionResult.id}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Manuscript Title:</span>
                  <div className="font-bold text-slate-800 text-[11px] max-w-[280px] text-left dir-ltr truncate">
                    {submissionResult.title}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold">Author Email:</span>
                  <span className="font-mono text-slate-700">{submissionResult.authorEmail}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 font-bold">Submission Date:</span>
                  <span className="font-bold text-slate-800">{submissionResult.submissionDate}</span>
                </div>
              </div>

              {/* Action Buttons for Email Receipt & Tracking Status */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    if (onOpenEmailReceipt && submissionResult) {
                      onOpenEmailReceipt(submissionResult);
                    }
                  }}
                  className="w-full sm:w-auto flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Preview Email Receipt</span>
                </button>

                <button
                  onClick={() => {
                    const idToTrack = submissionResult.id;
                    resetForm();
                    if (onOpenTrackStatus) {
                      onOpenTrackStatus(idToTrack);
                    }
                  }}
                  className="w-full sm:w-auto flex-1 bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Manuscript Status</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
