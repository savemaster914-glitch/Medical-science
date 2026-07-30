import React, { useState } from 'react';
import { Article } from '../types';
import { 
  X, 
  FileText, 
  Download, 
  Eye, 
  Quote, 
  Sparkles, 
  Printer, 
  Code, 
  Globe, 
  Share2, 
  Check, 
  Copy,
  BookOpen,
  Calendar,
  Layers,
  FileCode
} from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onOpenAiAssistant: (article: Article) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onOpenAiAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<'abstract' | 'pdf' | 'html' | 'xml' | 'citations'>('abstract');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  if (!article) return null;

  const citations = {
    APA: `${article.authors.map(a => a.name).join(', ')}. (${article.year}). ${article.title}. Iraqi Medical Journal for Biomedicine, ${article.volume}(${article.issue}), https://doi.org/${article.doi}`,
    MLA: `${article.authors[0]?.name}, et al. "${article.title}." Iraqi Medical Journal for Biomedicine, vol. ${article.volume}, no. ${article.issue}, ${article.year}, doi:${article.doi}.`,
    Harvard: `${article.authors.map(a => a.name).join(', ')}, ${article.year}. ${article.title}. Iraqi Medical Journal for Biomedicine, ${article.volume}(${article.issue}).`,
    BibTeX: `@article{imjb${article.year}_${article.issue},\n  author = {${article.authors.map(a => a.name).join(' and ')}},\n  title = {${article.title}},\n  journal = {Iraqi Medical Journal for Biomedicine},\n  volume = {${article.volume}},\n  number = {${article.issue}},\n  year = {${article.year}},\n  doi = {${article.doi}}\n}`,
    RIS: `TY  - JOUR\nTI  - ${article.title}\nAU  - ${article.authors.map(a => a.name).join('\nAU  - ')}\nJO  - Iraqi Medical Journal for Biomedicine\nVL  - ${article.volume}\nIS  - ${article.issue}\nPY  - ${article.year}\nDO  - ${article.doi}\nER  -`
  };

  const handleCopyCitation = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(format);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col text-left">
        {/* Modal Header Bar */}
        <div className="bg-[#081F45] text-white p-5 border-b border-[#184A87] flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase bg-[#C79A3D] text-[#081F45] px-2.5 py-0.5 rounded">
              {article.articleType}
            </span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              DOI: {article.doi}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiAssistant(article)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Lay Summary</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 ml-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700 no-print">
          <button
            onClick={() => setActiveTab('abstract')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'abstract' ? 'bg-[#081F45] text-white' : 'hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Abstract & Info</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'pdf' ? 'bg-[#081F45] text-white' : 'hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#C79A3D]" />
            <span>PDF Reader</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'html' ? 'bg-[#081F45] text-white' : 'hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Full HTML Text</span>
          </button>

          <button
            onClick={() => setActiveTab('xml')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'xml' ? 'bg-[#081F45] text-white' : 'hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>XML JATS</span>
          </button>

          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'citations' ? 'bg-[#081F45] text-white' : 'hover:bg-slate-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Export Citation</span>
          </button>
        </div>

        {/* Modal Scrollable Content Container */}
        <div className="p-6 overflow-y-auto flex-1 article-print-body space-y-6">
          {activeTab === 'abstract' && (
            <div className="space-y-6">
              {/* Title & Scope */}
              <div>
                <span className="text-xs font-bold text-[#184A87] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {article.scope}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-[#081F45] mt-3 leading-tight">
                  {article.title}
                </h1>
              </div>

              {/* Authors & Affiliations */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Authors & Affiliations</div>
                <div className="space-y-1">
                  {article.authors.map((author, i) => (
                    <div key={i} className="text-slate-700">
                      <strong>{author.name}</strong> {author.isCorresponding && <span className="text-blue-700 font-bold">(Corresponding Author)</span>}
                      <span className="text-slate-500 block text-[11px]">{author.affiliation}</span>
                      {author.email && <span className="text-[#184A87] font-mono text-[10px]">{author.email}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates & Publication Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#081F45] text-white p-4 rounded-xl">
                <div>
                  <span className="text-slate-300 text-[10px] block">Received Date</span>
                  <span className="font-semibold">{article.receivedDate}</span>
                </div>
                <div>
                  <span className="text-slate-300 text-[10px] block">Accepted Date</span>
                  <span className="font-semibold">{article.acceptedDate}</span>
                </div>
                <div>
                  <span className="text-slate-300 text-[10px] block">Published Date</span>
                  <span className="font-semibold">{article.publicationDate}</span>
                </div>
                <div>
                  <span className="text-slate-300 text-[10px] block">Issue</span>
                  <span className="font-semibold text-[#C79A3D]">Vol {article.volume}, Issue {article.issue}</span>
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-playfair text-[#081F45] border-b border-slate-200 pb-1">
                  Abstract
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-inter">
                  {article.abstract}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {article.keywords.map((kw, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-[#081F45] px-2.5 py-1 rounded font-medium border border-slate-200">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Figures Gallery */}
              {article.figures && article.figures.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-bold font-playfair text-[#081F45]">
                    Article Figures & Micrographs ({article.figures.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {article.figures.map(fig => (
                      <div key={fig.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-3 space-y-2">
                        <img
                          src={fig.url}
                          alt={fig.caption}
                          className="w-full h-48 object-cover rounded-lg border"
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-xs text-slate-600 font-inter leading-tight">
                          {fig.caption}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {article.references && article.references.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-200 text-xs">
                  <h3 className="text-lg font-bold font-playfair text-[#081F45]">
                    References ({article.references.length})
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 font-mono">
                    {article.references.map((ref, idx) => (
                      <li key={idx} className="leading-relaxed">{ref}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="bg-[#081F45] text-white p-4 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C79A3D]" />
                  <span>Interactive Academic PDF Reader • IMJB Official Layout</span>
                </div>
                <button
                  onClick={() => alert(`Downloading PDF: ${article.doi}.pdf`)}
                  className="bg-[#C79A3D] text-[#081F45] font-bold px-3 py-1.5 rounded hover:bg-amber-400 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF (2.4 MB)</span>
                </button>
              </div>

              {/* PDF Document Render Container */}
              <div className="border border-slate-300 rounded-xl p-8 bg-white shadow-inner font-serif space-y-6 text-left max-w-3xl mx-auto border-t-8 border-t-[#081F45]">
                {/* PDF Header Header */}
                <div className="border-b border-slate-300 pb-4 flex justify-between items-end text-xs text-slate-500 font-sans">
                  <div>
                    <div className="font-bold text-[#081F45] uppercase tracking-wider">Iraqi Medical Journal for Biomedicine</div>
                    <div>Vol {article.volume}, Issue {article.issue} ({article.year}) • Open Access</div>
                  </div>
                  <div className="text-right font-mono">
                    DOI: {article.doi}
                  </div>
                </div>

                <div className="text-xs uppercase font-sans font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                  {article.articleType}
                </div>

                <h2 className="text-2xl font-extrabold text-[#081F45] leading-tight font-playfair">
                  {article.title}
                </h2>

                <div className="text-xs font-sans text-slate-700 font-semibold border-b pb-4">
                  {article.authors.map(a => `${a.name} (${a.affiliation})`).join('; ')}
                </div>

                <div className="bg-slate-50 p-4 border-l-4 border-[#081F45] text-xs font-sans space-y-1">
                  <strong className="text-[#081F45] block">ABSTRACT</strong>
                  <p className="text-slate-700 leading-relaxed font-inter">{article.abstract}</p>
                </div>

                <div className="text-sm leading-relaxed text-slate-800 space-y-4 font-sans font-normal" dangerouslySetInnerHTML={{ __html: article.htmlContent }}>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-4 text-left font-sans">
              <h2 className="text-2xl font-bold font-playfair text-[#081F45]">{article.title}</h2>
              <div className="prose max-w-none text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.htmlContent }}></div>
            </div>
          )}

          {activeTab === 'xml' && (
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>JATS XML Schema v1.2</span>
                <button
                  onClick={() => handleCopyCitation('xml', article.xmlContent)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded border flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy XML Code</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-700">
                {article.xmlContent}
              </pre>
            </div>
          )}

          {activeTab === 'citations' && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-xl font-bold font-playfair text-[#081F45]">Export Citation Formats</h3>
                <p className="text-xs text-slate-600 mt-1">Copy citations directly into EndNote, Mendeley, Zotero, or manuscript reference lists.</p>
              </div>

              <div className="space-y-4">
                {Object.entries(citations).map(([format, text]) => (
                  <div key={format} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#081F45] bg-[#C79A3D]/20 px-2 py-0.5 rounded">
                        {format} Format
                      </span>
                      <button
                        onClick={() => handleCopyCitation(format, text)}
                        className="text-xs bg-[#081F45] hover:bg-[#184A87] text-white px-3 py-1 rounded flex items-center gap-1 transition-colors font-bold"
                      >
                        {copiedCitation === format ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-800 font-mono bg-white p-3 rounded border whitespace-pre-wrap leading-relaxed">
                      {text}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
