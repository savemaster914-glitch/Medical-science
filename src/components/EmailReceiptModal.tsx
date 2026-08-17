import React from 'react';
import { X, Mail, CheckCircle2, Download, Search, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { SubmissionRecord } from '../types';

interface EmailReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionRecord | null;
  onOpenTrackModal?: (query: string) => void;
}

export const EmailReceiptModal: React.FC<EmailReceiptModalProps> = ({
  isOpen,
  onClose,
  submission,
  onOpenTrackModal
}) => {
  if (!isOpen || !submission) return null;

  const handleDownloadReceiptText = () => {
    const text = `====================================================================
IRAQI JOURNAL OF BIOMEDICAL AND CLINICAL MEDICINE (IJBCM)
OFFICIAL MANUSCRIPT SUBMISSION RECEIPT & ACKNOWLEDGMENT
====================================================================

Recipient Author: ${submission.correspondingAuthor}
Author Email: ${submission.authorEmail}
Institution: ${submission.institution || 'Al-Habbobi Teaching Hospital'}

JOURNAL DETAILS:
Journal Name: Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
Publisher: Department of Medical Laboratories, Al-Habbobi Teaching Hospital / Directorate of Health
ISSN: 2958-8421 (Online)
Website: https://ijbcm-iq.org

SUBMISSION ACKNOWLEDGMENT DETAILS:
Manuscript ID: ${submission.id}
Tracking Reference Code: ${submission.trackingCode || 'TRK-98210'}
Submission Date: ${submission.submissionDate}
Article Type: ${submission.articleType}
Scope Category: ${submission.scope}

MANUSCRIPT TITLE:
"${submission.title}"

ATTACHED SUBMISSION FILES:
1. Main Manuscript Document: ${submission.fileName || 'Main_Manuscript.docx'}
2. Cover Letter File: ${submission.coverLetterFileName || 'Cover_Letter.docx'}
3. Title Page File: ${submission.titlePageFileName || 'Title_Page.docx'}

INITIAL STATUS:
Submitted / Under Initial Editorial Quality Check

STATEMENT OF ACKNOWLEDGMENT:
This official email receipt acknowledges that the Editorial Board of the Iraqi Journal of Biomedical and Clinical Medicine (IJBCM) has received your submitted manuscript. Your submission will now undergo an initial editorial review followed by double-blind peer review.

You may track the live evaluation status of your manuscript at any time on the IJBCM portal using your Manuscript ID (${submission.id}) or your registered email address.

Sincerely,
Editorial Board & Managing Editor
Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
https://ijbcm-iq.org
====================================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IMJB_Receipt_${submission.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden text-left dir-ltr flex flex-col">
        {/* Email Header Bar */}
        <div className="bg-[#081F45] text-white p-4 flex items-center justify-between border-b border-[#184A87]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#C79A3D] font-bold uppercase tracking-wider block">
                Official Confirmation Email Notice
              </span>
              <h3 className="text-sm font-bold text-white font-playfair">
                Submission Receipt Acknowledgment - IMJB Journal
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Mock Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          {/* Email Envelope Meta Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">To:</span>
              <span className="font-mono font-bold text-[#081F45] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {submission.authorEmail}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">From:</span>
              <span className="font-mono text-slate-700">
                submissions@imjb-iq.org (Editorial Board of IMJB)
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-bold">Subject:</span>
              <span className="font-bold text-[#081F45]">
                [IMJB] Submission Receipt Confirmation #{submission.id}
              </span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 text-xs text-slate-800 leading-relaxed shadow-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Official submission confirmation email sent successfully to your registered inbox.</span>
            </div>

            <p className="font-bold text-[#081F45]">
              Dear Author / {submission.correspondingAuthor},
            </p>

            <p>
              Greetings,<br />
              The Editorial Board of the <strong>Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</strong> confirms receipt of your scientific manuscript submission. Your submission details have been logged and routed for initial editorial screening and peer review.
            </p>

            {/* Official Data Summary Box */}
            <div className="bg-slate-100 border-2 border-dashed border-[#081F45]/30 p-4 rounded-xl space-y-2 font-sans">
              <div className="text-[11px] font-bold text-[#081F45] border-b border-slate-300 pb-1.5 flex items-center justify-between">
                <span>Submission Metadata & Receipt</span>
                <span className="bg-[#081F45] text-[#C79A3D] px-2 py-0.5 rounded text-[10px] font-mono">
                  Verified IJBCM Receipt
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-800 pt-1">
                <div><strong>Journal Name:</strong> Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</div>
                <div><strong>Manuscript ID:</strong> <span className="font-mono font-bold text-[#081F45]">{submission.id}</span></div>
                <div><strong>Tracking Code:</strong> <span className="font-mono text-emerald-800 font-bold">{submission.trackingCode || 'TRK-98210'}</span></div>
                <div><strong>Submission Date:</strong> {submission.submissionDate}</div>
                <div><strong>Article Type:</strong> {submission.articleType}</div>
                <div><strong>Scope Category:</strong> {submission.scope}</div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold block mb-0.5">Approved Manuscript Title:</span>
                <span className="font-bold font-playfair text-[#081F45] text-xs leading-snug block">
                  "{submission.title}"
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Submitted Files:</div>
                <div className="flex items-center gap-1">✔️ Main Manuscript File: <span className="font-mono text-slate-700">{submission.fileName || 'Main_Manuscript.docx'}</span></div>
                <div className="flex items-center gap-1">✔️ Cover Letter File: <span className="font-mono text-slate-700">{submission.coverLetterFileName || 'Cover_Letter.docx'}</span></div>
                <div className="flex items-center gap-1">✔️ Title Page File: <span className="font-mono text-slate-700">{submission.titlePageFileName || 'Title_Page.docx'}</span></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900 space-y-1 text-[11px]">
              <span className="font-bold flex items-center gap-1 text-[#081F45]">
                <Search className="w-3.5 h-3.5 text-[#C79A3D]" />
                Track Submission Status:
              </span>
              <p className="text-slate-700 leading-relaxed">
                You can track the live peer-review status and decisions at any time on the IMJB portal using your Manuscript ID (<strong>{submission.id}</strong>) or registered email address.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Sincerely,<br />
              <strong>Editorial Board & Managing Editor — Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</strong><br />
              Department of Medical Laboratories • Al-Habbobi Teaching Hospital • Thi-Qar Health Directorate
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleDownloadReceiptText}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt Text</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenTrackModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTrackModal(submission.id);
                }}
                className="bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Track Manuscript Status Now</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors"
            >
              Close Acknowledgment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
