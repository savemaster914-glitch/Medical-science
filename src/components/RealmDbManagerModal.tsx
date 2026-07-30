import React, { useState, useEffect } from 'react';
import { Database, HardDrive, RefreshCw, Trash2, Download, Upload, CheckCircle, ShieldCheck, FileText, Users, Activity, X } from 'lucide-react';
import { realmDB, exportRealmDBJSON, clearAndResetRealmDB, fetchAllSubmissionsFromDB } from '../db/localRealmDB';
import { SubmissionRecord } from '../types';

interface RealmDbManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmissionsUpdated: (newSubmissions: SubmissionRecord[]) => void;
}

export const RealmDbManagerModal: React.FC<RealmDbManagerModalProps> = ({
  isOpen,
  onClose,
  onSubmissionsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'reviewers' | 'logs' | 'stats'>('submissions');
  const [dbSubmissions, setDbSubmissions] = useState<any[]>([]);
  const [dbReviewers, setDbReviewers] = useState<any[]>([]);
  const [dbLogs, setDbLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const subs = await realmDB.submissions.toArray();
      const revs = await realmDB.reviewers.toArray();
      const logs = await realmDB.logs.toArray();

      setDbSubmissions(subs);
      setDbReviewers(revs);
      setDbLogs(logs);
    } catch (err) {
      console.error('Error reading Realm DB tables:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const jsonStr = await exportRealmDBJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `IMJB_RealmDB_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg('تم تصدير قاعدة البيانات بنجاح (Database exported as JSON)');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDB = async () => {
    if (confirm('هل أنت تأكد من إعادة تهيئة قاعدة البيانات المحلية Realm DB بالأبحاث النموذجية؟')) {
      setIsLoading(true);
      const resetList = await clearAndResetRealmDB();
      await loadData();
      onSubmissionsUpdated(resetList);
      setIsLoading(false);
      setStatusMsg('تمت إعادة تهيئة قاعدة البيانات المحلية (Realm DB Reset Completed)');
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] text-left">
        {/* Header */}
        <div className="bg-[#081F45] text-white p-4 flex items-center justify-between border-b-2 border-b-[#C79A3D]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C79A3D] text-[#081F45] rounded-xs font-bold shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">إدارة قاعدة البيانات المحلية Realm DB / IndexedDB</h2>
                <span className="text-[10px] bg-green-500/20 text-green-300 font-mono px-2 py-0.5 rounded border border-green-500/30">
                  ● ACTIVE ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Local Client Database Engine connected for instant query & offline journal submission persistence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 border-b border-emerald-200 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {statusMsg}
            </span>
          </div>
        )}

        {/* Database Quick Stats bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-[11px] font-medium">اسم المحرك (DB Engine)</div>
            <div className="font-bold text-[#081F45] font-mono text-xs mt-0.5">IndexedDB / Dexie Realm</div>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-[11px] font-medium">عدد الأبحاث (Submissions)</div>
            <div className="font-extrabold text-[#C79A3D] text-sm mt-0.5">{dbSubmissions.length} record(s)</div>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-[11px] font-medium">المحكمون المسجلون (Reviewers)</div>
            <div className="font-bold text-[#081F45] text-sm mt-0.5">{dbReviewers.length} reviewer(s)</div>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
            <div className="text-slate-500 text-[11px] font-medium">سجلات العمليات (Audit Logs)</div>
            <div className="font-bold text-slate-700 text-sm mt-0.5">{dbLogs.length} log event(s)</div>
          </div>
        </div>

        {/* Toolbar Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'border-[#081F45] text-[#081F45] bg-white rounded-t-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C79A3D]" />
            <span>جدول الأبحاث (Submissions Table)</span>
          </button>
          <button
            onClick={() => setActiveTab('reviewers')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviewers'
                ? 'border-[#081F45] text-[#081F45] bg-white rounded-t-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-[#081F45]" />
            <span>جدول المحكمين (Reviewers Table)</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-[#081F45] text-[#081F45] bg-white rounded-t-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>سجل النظام (Logs Table)</span>
          </button>
        </div>

        {/* Table View Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#081F45]" />
              <span className="text-xs font-semibold">جاري قراءة الجداول من Realm DB...</span>
            </div>
          ) : activeTab === 'submissions' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded">
                <thead className="bg-[#081F45] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5">ID / Tracking</th>
                    <th className="p-2.5">Title</th>
                    <th className="p-2.5">Author</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {dbSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-[11px] font-bold text-[#081F45]">
                        <div>{s.id}</div>
                        <div className="text-slate-400 font-normal">{s.trackingCode}</div>
                      </td>
                      <td className="p-2.5 font-semibold text-slate-900 max-w-xs truncate">{s.title}</td>
                      <td className="p-2.5">{s.correspondingAuthor}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-xs bg-amber-100 text-amber-800 border border-amber-300">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500 text-[11px]">{s.submissionDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'reviewers' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded">
                <thead className="bg-[#081F45] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Reviewer Name</th>
                    <th className="p-2.5">Specialty</th>
                    <th className="p-2.5">Institution</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {dbReviewers.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-[11px] font-bold">{r.id}</td>
                      <td className="p-2.5 font-semibold text-[#081F45]">{r.name}</td>
                      <td className="p-2.5">{r.specialty}</td>
                      <td className="p-2.5 text-slate-500">{r.institution}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                          {r.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border border-slate-200 rounded">
                <thead className="bg-[#081F45] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Submission ID</th>
                    <th className="p-2.5">Action</th>
                    <th className="p-2.5">Actor</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {dbLogs.map((l, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-[11px] text-slate-400">{l.id || idx + 1}</td>
                      <td className="p-2.5 font-mono font-bold text-[#081F45]">{l.submissionId}</td>
                      <td className="p-2.5 font-medium">{l.action}</td>
                      <td className="p-2.5 text-slate-600">{l.actor}</td>
                      <td className="p-2.5 text-slate-500 text-[11px]">{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-xs shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#081F45]" />
              <span>تصدير نسخه إحتياطية JSON (Export Backup)</span>
            </button>
            <button
              onClick={handleResetDB}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-1.5 rounded-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إعادة تهيئة البيانات (Reset Seed)</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-[#081F45] hover:bg-[#184A87] text-white font-bold text-xs px-5 py-1.5 rounded-xs"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
