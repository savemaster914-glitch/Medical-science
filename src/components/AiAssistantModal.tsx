import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { Sparkles, X, CheckCircle, AlertCircle, RefreshCw, BookOpen, Lightbulb, Tag } from 'lucide-react';

interface AiAssistantModalProps {
  article: Article | null;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ article, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      fetchAiAnalysis();
    }
  }, [article]);

  const fetchAiAnalysis = async () => {
    if (!article) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          abstract: article.abstract,
          keywords: article.keywords,
          scope: article.scope
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to Gemini AI Assistant server.");
    } finally {
      setLoading(false);
    }
  };

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl text-left flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#081F45] via-purple-950 to-[#081F45] text-white p-5 flex items-center justify-between border-b border-purple-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C79A3D]" />
            <div>
              <h3 className="text-base font-bold font-playfair text-white">IMJB AI Biomedical Research Assistant</h3>
              <p className="text-[11px] text-purple-200">Powered by Gemini 2.5 Server-Side Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded">
              Selected Paper
            </span>
            <h4 className="text-sm font-bold font-playfair text-[#081F45] mt-1 leading-snug">
              {article.title}
            </h4>
          </div>

          {loading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Synthesizing biomedical lay summary & clinical takeaways...</p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              {/* Lay Summary Box */}
              <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <span>Non-Specialist Lay Summary</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-inter">
                  {result.laySummary}
                </p>
              </div>

              {/* Key Clinical Takeaways */}
              <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  <span>Key Clinical & Diagnostic Takeaways</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800 font-inter">
                  {Array.isArray(result.clinicalTakeaways) ? (
                    result.clinicalTakeaways.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-700">{result.clinicalTakeaways}</li>
                  )}
                </ul>
              </div>

              {/* Recommended MeSH Keywords */}
              {result.recommendedKeywords && (
                <div>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                    <Tag className="w-3.5 h-3.5 text-[#081F45]" />
                    <span>Suggested MeSH Indexing Terms:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recommendedKeywords.map((kw: string, idx: number) => (
                      <span key={idx} className="text-xs bg-slate-100 text-[#081F45] border border-slate-300 px-2.5 py-1 rounded font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestedFutureWork && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 font-inter italic">
                  <strong>Suggested Future Research:</strong> "{result.suggestedFutureWork}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
