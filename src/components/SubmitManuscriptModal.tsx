import React, { useState } from 'react';
import { X, Send, Upload, CheckCircle2, AlertCircle, FileText, UserCheck, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { ArticleType, SubmissionRecord } from '../types';

interface SubmitManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newSubmission: SubmissionRecord) => void;
  onNavigateToAdmin?: () => void;
}

export const SubmitManuscriptModal: React.FC<SubmitManuscriptModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitSuccess,
  onNavigateToAdmin
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
    agreedEthics: false,
    agreedOpenAccess: false,
    agreedOriginality: false
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, fileName: e.target.files[0].name });
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
      fileName: formData.fileName || 'Manuscript_Document.docx',
      abstract: formData.abstract || 'Structured abstract submitted by corresponding author.',
      keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [formData.scope, 'IMJB'],
      assignedReviewers: [],
      logs: [
        {
          date: todayStr,
          action: 'Manuscript Submitted to Admin Desk',
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
              <h3 className="text-base font-bold text-[#081F45] font-playfair">
                Step 3: Upload Manuscript & Ethical Declarations
              </h3>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <Upload className="w-8 h-8 text-[#081F45] mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">
                  {formData.fileName ? `Selected: ${formData.fileName}` : 'Upload Manuscript File (.docx / .pdf)'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ensure all author names are removed from the main manuscript text for double-blind review compliance.
                </p>
                <input
                  type="file"
                  accept=".docx,.pdf,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                  id="manuscript-file-input"
                />
                <label
                  htmlFor="manuscript-file-input"
                  className="mt-3 inline-block bg-[#081F45] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#184A87]"
                >
                  Browse Files
                </label>
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
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-playfair text-[#081F45]">
                Manuscript Successfully Submitted!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for submitting your research to the Iraqi Medical Journal for Biomedicine. Your manuscript has been logged into the editorial queue.
              </p>

              <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
                <div>
                  <span className="text-slate-500">Tracking Reference Code:</span>
                  <div className="text-lg font-bold font-mono text-[#081F45]">
                    {submissionResult.trackingCode}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Title:</span>
                  <div className="font-semibold text-slate-800">{formData.title}</div>
                </div>
                <div>
                  <span className="text-slate-500">Current Status:</span>
                  <div className="inline-block bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px] ml-2">
                    Initial Editorial Check
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-lg"
                >
                  إغلاق النافذة (Done & Close)
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    if (onNavigateToAdmin) onNavigateToAdmin();
                  }}
                  className="w-full sm:w-auto bg-[#081F45] text-[#C79A3D] text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-[#184A87] shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>انتقال إلى لوحة الأدمن لمشاهدة وتوجيه البحث (View in Admin)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
