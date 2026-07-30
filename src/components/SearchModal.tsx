import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../data/mockJournalData';
import { Article } from '../types';
import { Search, X, FileText, ArrowRight, Eye, Download } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectArticle }) => {
  const [query, setQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState('All');

  if (!isOpen) return null;

  const filtered = MOCK_ARTICLES.filter(a => {
    const matchesQuery = query === '' ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.abstract.toLowerCase().includes(query.toLowerCase()) ||
      a.authors.some(auth => auth.name.toLowerCase().includes(query.toLowerCase())) ||
      a.keywords.some(kw => kw.toLowerCase().includes(query.toLowerCase()));
    
    const matchesScope = selectedScope === 'All' || a.scope === selectedScope;
    return matchesQuery && matchesScope;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden text-left flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#081F45] text-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C79A3D]" />
          <input
            type="text"
            placeholder="Search by keywords (e.g. Acinetobacter, microRNA, Thalassemia, PCR)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-300 text-sm font-medium focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b pb-2">
            <span>Found {filtered.length} matching biomedical articles</span>
            <span>Showing peer-reviewed open access papers</span>
          </div>

          <div className="space-y-3">
            {filtered.map(article => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#081F45] p-4 rounded-xl transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded">
                    {article.articleType}
                  </span>
                  <span className="text-slate-500 font-mono">DOI: {article.doi}</span>
                </div>

                <h4 className="text-sm font-bold font-playfair text-[#081F45] group-hover:text-[#184A87] leading-snug">
                  {article.title}
                </h4>

                <p className="text-xs text-slate-600 font-medium">
                  {article.authors.map(a => a.name).join(', ')}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {article.abstract}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
