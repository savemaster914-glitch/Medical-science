import React from 'react';
import { MOCK_ISSUES, MOCK_ARTICLES } from '../data/mockJournalData';
import { Article } from '../types';
import { BookOpen, Calendar, FileText, Download, Eye, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface CurrentIssueSectionProps {
  onSelectArticle: (article: Article) => void;
  onNavigate: (page: string) => void;
}

export const CurrentIssueSection: React.FC<CurrentIssueSectionProps> = ({
  onSelectArticle,
  onNavigate,
}) => {
  const currentIssue = MOCK_ISSUES.find(i => i.status === 'Current') || MOCK_ISSUES[0];
  const currentArticles = MOCK_ARTICLES.filter(a => a.volume === currentIssue.volume && a.issue === currentIssue.issue);

  return (
    <section className="py-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2.5 py-0.5 rounded-xs">
              Quarterly Release
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold font-playfair text-[#081F45] mt-1.5">
              Current Issue Spotlight
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Volume {currentIssue.volume}, Issue {currentIssue.issue} • {currentIssue.month} {currentIssue.year} (Published: {currentIssue.publicationDate})
            </p>
          </div>

          <button
            onClick={() => onNavigate('current-issue')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#184A87] hover:text-[#081F45] uppercase tracking-wider"
          >
            <span>Browse Full Table of Contents</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C79A3D]" />
          </button>
        </div>

        {/* Current Issue Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cover & Editor Note */}
          <div className="lg:col-span-4 bg-[#081F45] text-white rounded-sm p-4 shadow-md border border-[#184A87] space-y-4">
            <div className="relative group overflow-hidden rounded-xs border-2 border-[#C79A3D]">
              <img
                src={currentIssue.coverImage}
                alt={`IMJB Vol ${currentIssue.volume} Issue ${currentIssue.issue} Cover`}
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081F45] via-transparent opacity-80"></div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                <span className="bg-[#C79A3D] text-[#081F45] font-extrabold text-[9px] px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
                  Official Issue Cover
                </span>
                <h3 className="text-base font-bold font-playfair text-white mt-1">
                  Volume {currentIssue.volume}, Issue {currentIssue.issue}
                </h3>
                <p className="text-[11px] text-amber-200">{currentIssue.month} {currentIssue.year}</p>
              </div>
            </div>

            {/* Editor's Note */}
            <div className="bg-white/5 border border-white/10 p-3 rounded-sm text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C79A3D] font-bold text-[10px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editor-in-Chief's Note</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug font-sans italic">
                "{currentIssue.editorNote}"
              </p>
              <div className="text-[10px] text-slate-400 font-semibold pt-0.5">
                — Prof. Dr. Tariq H. Al-ThiQari, MD, PhD
              </div>
            </div>

            <button
              onClick={() => onNavigate('current-issue')}
              className="w-full py-2 bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-bold text-xs uppercase tracking-wider rounded-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse All {currentArticles.length} Articles</span>
            </button>
          </div>

          {/* Right Column: Table of Contents Preview */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold font-playfair text-[#081F45]">
                Table of Contents ({currentArticles.length} Articles)
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Peer Reviewed • Open Access
              </span>
            </div>

            <div className="space-y-3">
              {currentArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#F6F7F9] hover:bg-white border-l-4 border-[#C79A3D] border-t border-r border-b border-slate-200 p-3.5 rounded-sm transition-all shadow-2xs hover:shadow-xs group text-left"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#081F45] bg-[#C79A3D]/20 border border-[#C79A3D]/40 px-2 py-0.5 rounded-xs">
                      {article.articleType}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      DOI: {article.doi}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onSelectArticle(article)}
                    className="text-sm font-bold font-playfair text-[#081F45] hover:text-[#184A87] cursor-pointer leading-tight"
                  >
                    {article.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    {article.authors.map(a => a.name).join(', ')}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-sans leading-relaxed">
                    {article.abstract}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2.5 border-t border-slate-200 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-500 font-mono text-[10px]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-600" />
                        {article.views} Views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-emerald-600" />
                        {article.downloads} Downloads
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArticle(article)}
                        className="px-2.5 py-1 bg-[#081F45] hover:bg-[#184A87] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3 h-3 text-[#C79A3D]" />
                        <span>Read Abstract & PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
