import React, { useState, useEffect } from 'react';
import { ActivePage, Article, SubmissionRecord } from './types';
import { INITIAL_ADMIN_SUBMISSIONS } from './data/adminMockData';
import { initRealmDatabase, addSubmissionToDB, fetchAllSubmissionsFromDB } from './db/localRealmDB';
import { RealmDbManagerModal } from './components/RealmDbManagerModal';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JournalInfoCards } from './components/JournalInfoCards';
import { JournalHighlights } from './components/JournalHighlights';
import { JournalStats } from './components/JournalStats';
import { CurrentIssueSection } from './components/CurrentIssueSection';
import { PublicationSchedule } from './components/PublicationSchedule';
import { LatestArticlesSection } from './components/LatestArticlesSection';
import { JournalScopeSection } from './components/JournalScopeSection';
import { EditorialWorkflow } from './components/EditorialWorkflow';
import { EditorialBoardSection } from './components/EditorialBoardSection';
import { ForAuthorsSection } from './components/ForAuthorsSection';
import { IndexingSection } from './components/IndexingSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { Footer } from './components/Footer';

// Modals
import { SubmitManuscriptModal } from './components/SubmitManuscriptModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SearchModal } from './components/SearchModal';
import { DashboardPortal } from './components/DashboardPortal';
import { MOCK_ARTICLES, MOCK_ISSUES, MOCK_ANNOUNCEMENTS } from './data/mockJournalData';

import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Send,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isRealmModalOpen, setIsRealmModalOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [aiArticle, setAiArticle] = useState<Article | null>(null);

  // Global Submissions State (Synced with Realm DB IndexedDB and LocalStorage fallback)
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(INITIAL_ADMIN_SUBMISSIONS);

  // Sync with Realm DB on startup
  useEffect(() => {
    initRealmDatabase().then(realmRecords => {
      if (realmRecords && realmRecords.length > 0) {
        setSubmissions(realmRecords);
      }
    }).catch(err => {
      console.warn('Realm DB init warning:', err);
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('imjb_admin_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error('Failed saving submissions:', e);
    }
  }, [submissions]);

  const handleAddSubmission = async (newSub: SubmissionRecord) => {
    setSubmissions(prev => [newSub, ...prev]);
    await addSubmissionToDB(newSub);
  };

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F9] text-[#222222] font-sans antialiased">
      {/* Sticky Header Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroSection
              onNavigate={setActivePage}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />
            <JournalInfoCards />
            <CurrentIssueSection
              onSelectArticle={(art) => setSelectedArticle(art)}
              onNavigate={setActivePage}
            />
            <JournalHighlights />
            <JournalStats />
            <LatestArticlesSection
              onSelectArticle={(art) => setSelectedArticle(art)}
              onOpenAiAssistant={(art) => setAiArticle(art)}
            />
            <PublicationSchedule
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            />
            <JournalScopeSection
              onNavigateToArticles={() => setActivePage('articles')}
            />
            <EditorialWorkflow />
            <IndexingSection />
            <AnnouncementsSection
              onNavigate={setActivePage}
              onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            />
          </>
        )}

        {activePage === 'about' && (
          <div className="py-14 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-left">
              <div className="border-b border-slate-200 pb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 px-3 py-1 rounded-full">
                  Journal Metadata & Credentials
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-playfair text-[#081F45] mt-3">
                  About Iraqi Medical Journal for Biomedicine (IMJB)
                </h1>
                <p className="text-sm text-slate-600 mt-2 font-inter">
                  Published by Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Thi-Qar Health Directorate, Dhi Qar, Iraq.
                </p>
              </div>

              <div className="prose max-w-none text-sm text-slate-700 leading-relaxed font-inter space-y-4">
                <p>
                  The <strong>Iraqi Medical Journal for Biomedicine (IMJB)</strong> is an international, double-blind peer-reviewed, open-access quarterly medical journal dedicated to publishing groundbreaking research, systematic reviews, case reports, and short communications across all medical laboratory and biomedical sciences.
                </p>

                <div className="bg-[#081F45] text-white p-6 rounded-2xl space-y-3">
                  <h3 className="text-xl font-bold font-playfair text-[#C79A3D]">Publication Frequency</h3>
                  <p className="text-xs text-slate-200">
                    IMJB is published <strong>Quarterly</strong> with four regular issues released each year:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold font-playfair pt-2">
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">Issue 1: March</div>
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">Issue 2: June</div>
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">Issue 3: September</div>
                    <div className="bg-white/10 p-3 rounded-lg border border-white/20">Issue 4: December</div>
                  </div>
                </div>

                <p>
                  The journal aims to elevate scientific excellence and clinical standards in laboratory medicine, molecular pathology, clinical chemistry, microbiology, hematology, immunology, and cancer biology throughout Iraq, the Middle East, and the global scientific community.
                </p>
              </div>

              <JournalInfoCards />
              <JournalHighlights />
            </div>
          </div>
        )}

        {activePage === 'aim-scope' && (
          <JournalScopeSection onNavigateToArticles={() => setActivePage('articles')} />
        )}

        {activePage === 'current-issue' && (
          <div className="py-12 bg-white">
            <CurrentIssueSection
              onSelectArticle={(art) => setSelectedArticle(art)}
              onNavigate={setActivePage}
            />
          </div>
        )}

        {activePage === 'archives' && (
          <div className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 px-3 py-1 rounded-full">
                  Published Issues Archive
                </span>
                <h1 className="text-3xl font-extrabold font-playfair text-[#081F45] mt-3">
                  Journal Archives (2023 – Present)
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Browse all previous quarterly volumes and issues of IMJB.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_ISSUES.map((issue, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-[#081F45] transition-all space-y-3">
                    <img
                      src={issue.coverImage}
                      alt={`Vol ${issue.volume} Issue ${issue.issue}`}
                      className="w-full h-52 object-cover rounded-xl border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase bg-[#081F45] text-[#C79A3D] px-2 py-0.5 rounded">
                        Vol {issue.volume}, Issue {issue.issue}
                      </span>
                      <h3 className="text-lg font-bold font-playfair text-[#081F45] mt-1">{issue.month} {issue.year}</h3>
                      <p className="text-xs text-slate-500">{issue.articlesCount} Peer-Reviewed Articles</p>
                    </div>
                    <button
                      onClick={() => setActivePage('articles')}
                      className="w-full py-2 bg-[#081F45] text-white text-xs font-bold rounded hover:bg-[#184A87]"
                    >
                      Browse Issue Articles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activePage === 'articles' && (
          <div className="py-12 bg-white">
            <LatestArticlesSection
              onSelectArticle={(art) => setSelectedArticle(art)}
              onOpenAiAssistant={(art) => setAiArticle(art)}
            />
          </div>
        )}

        {activePage === 'editorial-board' && (
          <EditorialBoardSection />
        )}

        {activePage === 'for-authors' && (
          <ForAuthorsSection onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
        )}

        {activePage === 'reviewer-guidelines' && (
          <div className="py-14 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-left space-y-6">
              <h1 className="text-3xl font-bold font-playfair text-[#081F45]">Reviewer Guidelines & Evaluation Rubric</h1>
              <p className="text-sm text-slate-600">
                IMJB relies on independent double-blind peer review to maintain academic excellence. Reviewers assess original methodology, statistical validity, clinical significance, and ethical compliance.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs font-inter">
                <h3 className="text-base font-bold text-[#081F45]">Peer Reviewer Scorecard Criteria:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li><strong>Scientific Novelty:</strong> Originality of hypothesis and research objectives.</li>
                  <li><strong>Methodological Rigor:</strong> Diagnostic assay precision, positive/negative controls, and statistical sample size calculations.</li>
                  <li><strong>Ethical Standards:</strong> IRB approval and patient informed consent.</li>
                  <li><strong>Conclusion Validity:</strong> Evidence directly supporting discussion claims.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activePage === 'ethics' && (
          <ForAuthorsSection onOpenSubmitModal={() => setIsSubmitModalOpen(true)} />
        )}

        {activePage === 'indexing' && (
          <IndexingSection />
        )}

        {activePage === 'announcements' && (
          <AnnouncementsSection
            onNavigate={setActivePage}
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          />
        )}

        {activePage === 'contact' && (
          <div className="py-14 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 px-3 py-1 rounded-full">
                  Editorial Contact
                </span>
                <h1 className="text-3xl font-extrabold font-playfair text-[#081F45] mt-3">
                  Contact Editorial Office
                </h1>
                <p className="text-sm text-slate-600 mt-1 font-inter">
                  Have questions regarding manuscript submission, peer review status, or subscription inquiries? Contact our team.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 bg-[#081F45] text-white p-6 rounded-2xl space-y-6">
                  <h3 className="text-xl font-bold font-playfair text-[#C79A3D]">Publisher Headquarters</h3>
                  <div className="space-y-4 text-xs font-inter">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#C79A3D] flex-shrink-0" />
                      <div>
                        <strong className="text-white block">Department of Medical Laboratories</strong>
                        <span>Al-Habbobi Teaching Hospital</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#C79A3D] flex-shrink-0" />
                      <div>
                        <span>Thi-Qar Health Directorate</span>
                        <span className="block text-slate-300">Dhi Qar Governorate, Iraq</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#C79A3D]" />
                      <span className="font-mono text-amber-200">editor@imjb-iq.org</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#C79A3D]" />
                      <span className="font-mono">+964 780 123 4567</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-bold font-playfair text-[#081F45]">Send Inquiry to Editorial Office</h3>
                  {contactSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h4 className="text-lg font-bold text-emerald-900">Message Delivered</h4>
                      <p className="text-xs text-slate-600">The Editorial Office will respond to your email within 24-48 business hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Dr. Full Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="your.email@institution.edu"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                        <input
                          type="text"
                          required
                          placeholder="Manuscript inquiry / Peer review question"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Write your message to the Editorial Board..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-[#081F45] text-white font-bold px-6 py-2.5 rounded-lg hover:bg-[#184A87]"
                      >
                        Send Inquiry
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === 'dashboard' && (
          <DashboardPortal 
            onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
            onOpenRealmDb={() => setIsRealmModalOpen(true)}
            submissions={submissions}
            setSubmissions={setSubmissions}
          />
        )}

        {(activePage === 'login' || activePage === 'register') && (
          <div className="py-16 bg-[#F6F7F9] min-h-[65vh] flex items-center justify-center p-4">
            <div className="bg-white border-t-4 border-t-[#081F45] border-x border-b border-slate-200 p-8 rounded-sm max-w-md w-full text-left space-y-5 shadow-xl">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 px-2.5 py-1 rounded-xs">
                  OJS 3.4 Authentication Portal
                </span>
                <h2 className="text-2xl font-bold font-playfair text-[#081F45] mt-2">
                  {activePage === 'login' ? 'Editor, Author & Reviewer Portal Login' : 'Register New Academic Account'}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Access Iraqi Medical Journal for Biomedicine (IMJB) editorial control panel and peer review queues.
                </p>
              </div>

              {/* Quick Admin Access Button */}
              <div className="bg-gradient-to-r from-[#081F45] to-[#184A87] p-4 rounded-sm text-white space-y-2 border border-[#C79A3D]/40 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C79A3D] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    الدخول السريع للأدمن
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-xs font-mono">Role: Editor Admin</span>
                </div>
                <p className="text-[11px] text-slate-200">
                  انقر هنا للدخول المباشر إلى لوحة الأدمن للتحكم بالبحوث والتوجيه للمقيمين:
                </p>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="w-full py-2 bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-extrabold text-xs rounded-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>الدخول المباشر إلى لوحة الأدمن (Enter Admin Panel)</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">أو تسجيل الدخول / Or Login</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setActivePage('dashboard'); }} className="space-y-3 text-xs">
                {activePage === 'register' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input type="text" required placeholder="Dr. Full Name" className="w-full px-3 py-2 border rounded-xs bg-white" />
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input type="email" required defaultValue="editor@imjb-iq.org" placeholder="editor@imjb-iq.org" className="w-full px-3 py-2 border rounded-xs bg-white" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input type="password" required defaultValue="••••••••" placeholder="••••••••" className="w-full px-3 py-2 border rounded-xs bg-white" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#081F45] text-white font-bold rounded-xs hover:bg-[#184A87] transition-colors uppercase tracking-wider text-xs"
                >
                  {activePage === 'login' ? 'Sign In to Portal' : 'Create Account'}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                {activePage === 'login' ? (
                  <button onClick={() => setActivePage('register')} className="hover:underline text-[#184A87] font-semibold">Don't have an account? Register</button>
                ) : (
                  <button onClick={() => setActivePage('login')} className="hover:underline text-[#184A87] font-semibold">Already registered? Login</button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SubmitManuscriptModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={handleAddSubmission}
        onNavigateToAdmin={() => setActivePage('dashboard')}
      />

      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenAiAssistant={(art) => setAiArticle(art)}
      />

      <AiAssistantModal
        article={aiArticle}
        onClose={() => setAiArticle(null)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      <RealmDbManagerModal
        isOpen={isRealmModalOpen}
        onClose={() => setIsRealmModalOpen(false)}
        onSubmissionsUpdated={(newSubs) => setSubmissions(newSubs)}
      />

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />
    </div>
  );
}
