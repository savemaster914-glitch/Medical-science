import React, { useState } from 'react';
import { MOCK_ARTICLES } from '../data/mockJournalData';
import { Article } from '../types';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  Quote, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpDown,
  Code,
  CheckCircle2
} from 'lucide-react';

interface LatestArticlesSectionProps {
  onSelectArticle: (article: Article) => void;
  onOpenAiAssistant: (article: Article) => void;
}

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  onSelectArticle,
  onOpenAiAssistant,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const articleTypes = ['All', 'Original Research', 'Systematic Review', 'Case Report', 'Short Communication'];

  const filteredArticles = MOCK_ARTICLES.filter(article => {
    const matchesType = selectedType === 'All' || article.articleType === selectedType;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.authors.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
              Peer Reviewed & Open Access
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#081F45] mt-1.5">
              Latest Published Articles
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Explore original research, systematic reviews, and short communications published in IMJB.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword, author, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-xs focus:ring-1 focus:ring-[#081F45] focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {articleTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-xs text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-[#081F45] text-[#C79A3D]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-slate-50/70 hover:bg-white border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 rounded-sm p-4 transition-all shadow-2xs hover:shadow-xs text-left group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Optional Graphical abstract thumbnail */}
                {article.coverImage && (
                  <div className="lg:col-span-3">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-36 object-cover rounded-xs border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Article Info */}
                <div className={article.coverImage ? "lg:col-span-9 space-y-2" : "lg:col-span-12 space-y-2"}>
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2 py-0.5 rounded-xs">
                        {article.articleType}
                      </span>
                      <span className="text-[10px] text-[#184A87] font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-200">
                        {article.scope}
                      </span>
                      {article.isEditorChoice && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-xs border border-amber-300 uppercase tracking-wider">
                          Editor's Choice
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      DOI: {article.doi}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="text-base font-bold font-playfair text-[#081F45] hover:text-[#184A87] cursor-pointer leading-tight"
                  >
                    {article.title}
                  </h3>

                  {/* Authors list */}
                  <div className="text-xs text-slate-700 font-medium">
                    {article.authors.map((author, index) => (
                      <span key={index}>
                        <span className="font-semibold text-slate-900">{author.name}</span>
                        {author.orcid && (
                          <span className="inline-block ml-1 text-emerald-600 text-[9px] font-mono">
                            [ORCID]
                          </span>
                        )}
                        {index < article.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Dates */}
                  <div className="text-[10px] text-slate-500 flex flex-wrap gap-3 font-sans">
                    <span><strong>Received:</strong> {article.receivedDate}</span>
                    <span><strong>Accepted:</strong> {article.acceptedDate}</span>
                    <span><strong>Published:</strong> {article.publicationDate}</span>
                    <span><strong>Volume:</strong> Vol {article.volume}, Issue {article.issue} ({article.year})</span>
                  </div>

                  {/* Abstract snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                    {article.abstract}
                  </p>

                  {/* Keywords tags */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {article.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded-xs">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200">
                    <div className="flex items-center gap-3 text-[10px] text-slate-600 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-600" />
                        <strong>{article.views}</strong> Views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-emerald-600" />
                        <strong>{article.downloads}</strong> Downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Quote className="w-3 h-3 text-purple-600" />
                        <strong>{article.citations}</strong> Citations
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenAiAssistant(article)}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors"
                        title="Generate AI Lay Summary & Key Takeaways"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>AI Summary</span>
                      </button>

                      <button
                        onClick={() => onSelectArticle(article)}
                        className="px-3 py-1 bg-[#081F45] hover:bg-[#184A87] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-[#C79A3D]" />
                        <span>View Full Article & PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
