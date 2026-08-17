import React, { useState, useEffect } from 'react';
import { ActivePage, Article, SubmissionRecord, UserAccount } from './types';
import { INITIAL_ADMIN_SUBMISSIONS } from './data/adminMockData';
import { ALL_SYSTEM_USERS, ADMIN_ACCOUNT, REVIEWER_ACCOUNTS } from './data/authAccounts';
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
import { TrackManuscriptModal } from './components/TrackManuscriptModal';
import { EmailReceiptModal } from './components/EmailReceiptModal';
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
  CheckCircle2,
  LogIn
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [trackInitialQuery, setTrackInitialQuery] = useState<string>('');
  const [isEmailReceiptOpen, setIsEmailReceiptOpen] = useState<boolean>(false);
  const [emailReceiptSubmission, setEmailReceiptSubmission] = useState<SubmissionRecord | null>(null);
  const [isRealmModalOpen, setIsRealmModalOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [aiArticle, setAiArticle] = useState<Article | null>(null);

  // User Auth State & Registered Users List
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('imjb_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ALL_SYSTEM_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('imjb_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [loginInputEmail, setLoginInputEmail] = useState('');
  const [loginInputPassword, setLoginInputPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regRole, setRegRole] = useState<'editor-in-chief' | 'editor' | 'reviewer' | 'author'>('author');
  const [regInstitution, setRegInstitution] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('imjb_current_user', JSON.stringify(currentUser));
        localStorage.setItem('imjb_saved_credentials', JSON.stringify({
          username: currentUser.username || currentUser.email,
          password: currentUser.password
        }));
      } else {
        localStorage.removeItem('imjb_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('imjb_current_user');
    } catch (e) {}
    setActivePage('home');
  };

  const handlePerformLogin = (emailOrUser: string, pass: string) => {
    setLoginError(null);
    const targetStr = emailOrUser.trim().toLowerCase();
    const found = registeredUsers.find(
      u => (u.email.toLowerCase() === targetStr || u.username.toLowerCase() === targetStr) && u.password === pass
    );

    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem('imjb_saved_credentials', JSON.stringify({
          username: found.username || found.email,
          password: found.password
        }));
      } catch (e) {}
      setActivePage('dashboard');
    } else {
      setLoginError('Sorry, invalid username, email, or password. Please verify and use one of the available accounts.');
    }
  };

  const handlePerformRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter and confirm your password.');
      return;
    }

    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === regEmail.trim().toLowerCase() || u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );

    if (existing) {
      setRegError('Email or username is already registered. Please use different details or sign in.');
      return;
    }

    if (regRole === 'editor-in-chief' || regRole === 'editor') {
      setRegError('تنبيه: تسجيل حساب رئيس التحرير أو المحرر محشور بمدير النظام فقط ولا يتاح للجمهور. يرجى اختيار صفة باحث أو مقيم علمي للتسجيل.');
      return;
    }

    let baseRole: 'editor' | 'reviewer' | 'author' = 'author';
    let roleTitleEnglish = 'Author / Researcher';

    if (regRole === 'reviewer') {
      baseRole = 'reviewer';
      roleTitleEnglish = 'Accredited Peer Reviewer';
    } else if (regRole === 'author') {
      baseRole = 'author';
      roleTitleEnglish = 'Author / Researcher';
    }

    const newRevId = baseRole === 'reviewer' ? `REV-${Math.floor(100 + Math.random() * 900)}` : undefined;

    const newUser: UserAccount = {
      id: `USR-REG-${Date.now()}`,
      username: regUsername.trim(),
      email: regEmail.trim(),
      password: regPassword,
      name: regFullName.trim(),
      role: baseRole,
      reviewerId: newRevId,
      institution: regInstitution.trim() || 'University of Baghdad - Iraq',
      specialty: regSpecialty.trim() || 'Medical & Biological Sciences'
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('imjb_registered_users', JSON.stringify(updated));
    } catch (err) {}

    setCurrentUser(newUser);
    setRegSuccess(`✅ Congratulations! Your account has been created successfully as (${roleTitleEnglish}). Redirecting to portal...`);

    setTimeout(() => {
      setActivePage('dashboard');
    }, 1200);
  };

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
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const handleOpenSubmitModal = () => {
    if (!currentUser) {
      setAuthNotice('📝 تنبيه هام: لا يمكن رفع وإرسال البحث بدون إكمال التسجيل في النظام أولاً. يرجى إنشاء حساب باحث جديد أو تسجيل الدخول للاستمرار (Account Registration Required for Manuscript Submission).');
      setActivePage('register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitModalOpen(true);
    }
  };

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
        onOpenSubmitModal={handleOpenSubmitModal}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenTrackModal={() => {
          setTrackInitialQuery('');
          setIsTrackModalOpen(true);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroSection
              onNavigate={setActivePage}
              onOpenSubmitModal={handleOpenSubmitModal}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
              onOpenTrackModal={() => {
                setTrackInitialQuery('');
                setIsTrackModalOpen(true);
              }}
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
              onOpenSubmitModal={handleOpenSubmitModal}
            />
            <JournalScopeSection
              onNavigateToArticles={() => setActivePage('articles')}
            />
            <EditorialWorkflow />
            <IndexingSection />
            <AnnouncementsSection
              onNavigate={setActivePage}
              onOpenSubmitModal={handleOpenSubmitModal}
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
                  About Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
                </h1>
                <p className="text-sm text-slate-600 mt-2 font-inter">
                  Published by Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Thi-Qar Health Directorate, Dhi Qar, Iraq.
                </p>
              </div>

              <div className="prose max-w-none text-sm text-slate-700 leading-relaxed font-inter space-y-4">
                <p>
                  The <strong>Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</strong> is an international, double-blind peer-reviewed, open-access quarterly medical journal dedicated to publishing groundbreaking research, systematic reviews, case reports, and short communications across all medical laboratory, clinical medicine, and biomedical sciences.
                </p>

                <div className="bg-[#081F45] text-white p-6 rounded-2xl space-y-3">
                  <h3 className="text-xl font-bold font-playfair text-[#C79A3D]">Publication Frequency</h3>
                  <p className="text-xs text-slate-200">
                    IJBCM is published <strong>Quarterly</strong> with four regular issues released each year:
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
          <ForAuthorsSection onOpenSubmitModal={handleOpenSubmitModal} />
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
          <ForAuthorsSection onOpenSubmitModal={handleOpenSubmitModal} />
        )}

        {activePage === 'indexing' && (
          <IndexingSection />
        )}

        {activePage === 'announcements' && (
          <AnnouncementsSection
            onNavigate={setActivePage}
            onOpenSubmitModal={handleOpenSubmitModal}
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
          currentUser ? (
            <DashboardPortal 
              onOpenSubmitModal={handleOpenSubmitModal}
              onOpenRealmDb={() => setIsRealmModalOpen(true)}
              submissions={submissions}
              setSubmissions={setSubmissions}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          ) : (
            <div className="py-16 bg-[#F6F7F9] min-h-[70vh] flex flex-col items-center justify-center p-4">
              <div className="bg-white border-t-4 border-t-[#081F45] border-x border-b border-slate-200 p-8 rounded-sm max-w-lg w-full text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 bg-amber-100 text-[#081F45] rounded-full flex items-center justify-center mx-auto border border-amber-300">
                  <ShieldCheck className="w-8 h-8 text-[#081F45]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-playfair text-[#081F45]">Sign In Required</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Accessing the Editor, Reviewer, or Author Portal requires logging in with your account username and password.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActivePage('login')}
                    className="w-full py-3 bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-extrabold rounded-xs transition-colors text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Go to Sign In Portal</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {(activePage === 'login' || activePage === 'register') && (
          <div className="py-12 bg-[#F6F7F9] min-h-[75vh] flex flex-col items-center justify-center p-4 space-y-8">
            <div className="bg-white border-t-4 border-t-[#081F45] border-x border-b border-slate-200 p-6 sm:p-8 rounded-sm max-w-2xl w-full text-left space-y-6 shadow-xl">
              
              {authNotice && (
                <div className="bg-amber-50 border-l-4 border-l-[#C79A3D] p-3 rounded-xs text-[#081F45] text-xs font-semibold flex items-center justify-between shadow-2xs">
                  <span>{authNotice}</span>
                  <button onClick={() => setAuthNotice(null)} className="text-slate-400 hover:text-slate-600 ml-2 font-bold text-sm">✕</button>
                </div>
              )}

              {/* Tab navigation */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => { setActivePage('login'); setLoginError(null); }}
                  className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
                    activePage === 'login'
                      ? 'border-[#081F45] text-[#081F45] bg-slate-50/80 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#C79A3D]" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActivePage('register'); setRegError(null); setRegSuccess(null); }}
                  className={`flex-1 py-3 text-center font-bold text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2 ${
                    activePage === 'register'
                      ? 'border-[#081F45] text-[#081F45] bg-slate-50/80 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#C79A3D]" />
                  <span>Register Account</span>
                </button>
              </div>

              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#081F45] bg-[#C79A3D]/20 px-2.5 py-1 rounded-xs">
                  OJS 3.4 Academic Portal Authentication
                </span>
                <h2 className="text-2xl font-bold font-playfair text-[#081F45] mt-2">
                  {activePage === 'login' ? 'System Sign In Portal' : 'Create New Account & Select Role'}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  {activePage === 'login' 
                    ? 'Sign in as Editor-in-Chief, Section Editor, Peer Reviewer, or Author to access your portal.'
                    : 'Create your account and specify your academic role (Editor, Reviewer, or Author).'}
                </p>
              </div>

              {/* Login Form */}
              {activePage === 'login' && (
                <div className="space-y-6">
                  {loginError && (
                    <div className="bg-rose-50 border-l-4 border-l-rose-600 p-3 rounded-xs text-rose-800 text-xs font-semibold">
                      {loginError}
                    </div>
                  )}

                  <form 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      handlePerformLogin(loginInputEmail, loginInputPassword); 
                    }} 
                    className="space-y-4 text-xs"
                  >
                    <div>
                      <label className="block font-bold text-[#081F45] mb-1">
                        Username / Email Address:
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={loginInputEmail} 
                        onChange={(e) => setLoginInputEmail(e.target.value)}
                        placeholder="editor@imjb-iq.org or tariq.aljanabi" 
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xs bg-white text-slate-900 font-mono text-xs focus:ring-2 focus:ring-[#081F45]" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#081F45] mb-1">
                        Password:
                      </label>
                      <input 
                        type="password" 
                        required 
                        value={loginInputPassword} 
                        onChange={(e) => setLoginInputPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xs bg-white text-slate-900 text-xs focus:ring-2 focus:ring-[#081F45]" 
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-extrabold rounded-xs transition-colors uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sign In to System</span>
                    </button>
                  </form>

                  {/* Editor-in-Chief Credentials Guide Card */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2 text-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#081F45] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#C79A3D]" />
                        <span>Editor-in-Chief Credentials</span>
                      </span>
                      <span className="text-[10px] bg-[#081F45] text-[#C79A3D] px-2 py-0.5 rounded-xs font-mono font-bold">
                        Role: Editor-in-Chief
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Use the username and password below to log in as Editor-in-Chief:
                    </p>
                    <div className="bg-white p-2.5 rounded-xs border border-slate-200 font-mono text-[11px] space-y-1 text-slate-700">
                      <div><strong className="text-slate-500">Username:</strong> admin</div>
                      <div><strong className="text-slate-500">Email:</strong> editor@imjb-iq.org</div>
                      <div><strong className="text-slate-500">Password:</strong> admin123</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginInputEmail('admin');
                        setLoginInputPassword('admin123');
                      }}
                      className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xs transition-colors text-center mt-1"
                    >
                      Fill Editor Credentials in Sign In Form
                    </button>
                  </div>

                  <div className="text-center pt-2 text-xs border-t border-slate-100">
                    <span className="text-slate-500">Don't have an account yet? </span>
                    <button 
                      onClick={() => setActivePage('register')}
                      className="text-[#184A87] font-bold hover:underline"
                    >
                      Create New Account Now
                    </button>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              {activePage === 'register' && (
                <form onSubmit={handlePerformRegister} className="space-y-5 text-xs">
                  {regError && (
                    <div className="bg-rose-50 border-l-4 border-l-rose-600 p-3 rounded-xs text-rose-800 text-xs font-semibold">
                      {regError}
                    </div>
                  )}

                  {regSuccess && (
                    <div className="bg-emerald-50 border-l-4 border-l-emerald-600 p-3 rounded-xs text-emerald-900 text-xs font-bold">
                      {regSuccess}
                    </div>
                  )}

                  {/* Role Selector Grid */}
                  <div className="space-y-2.5">
                    <div className="bg-slate-50 border-l-4 border-l-[#081F45] p-3 rounded-xs text-[#081F45] text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
                      <ShieldCheck className="w-5 h-5 text-[#C79A3D] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-[#081F45] text-[11px]">
                          حسابات الإدارة ورئاسة التحرير محمية / Editor Role Restricted
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                          تسجيل حسابات رئيس التحرير والمحررين خاص بإدارة النظام فقط (Admin Portal). يُتاح التسجيل المباشر أدناه للباحثين والمقيمين العلميّين فقط.
                        </p>
                      </div>
                    </div>

                    <label className="block font-extrabold text-[#081F45] mb-1 uppercase tracking-wider text-[11px]">
                      اختر صفة التسجيل الأكاديمية / Select Registration Role:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Author / Researcher */}
                      <div
                        onClick={() => setRegRole('author')}
                        className={`p-3.5 rounded-xs border cursor-pointer transition-all ${
                          regRole === 'author'
                            ? 'bg-[#081F45] text-white border-[#081F45] shadow-md'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-[#081F45]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center gap-1.5 text-xs">
                            <span>✍️</span>
                            <span>باحث / مؤلف (Author & Researcher)</span>
                          </span>
                          {regRole === 'author' && <span className="text-[#C79A3D] text-xs font-extrabold">✓ تم الاختيار</span>}
                        </div>
                        <p className={`text-[11px] ${regRole === 'author' ? 'text-slate-200' : 'text-slate-500'}`}>
                          تقديم الأبحاث والمسودات، متابعة مراحل التحكيم، ورفع التعديلات.
                        </p>
                      </div>

                      {/* Peer Reviewer */}
                      <div
                        onClick={() => setRegRole('reviewer')}
                        className={`p-3.5 rounded-xs border cursor-pointer transition-all ${
                          regRole === 'reviewer'
                            ? 'bg-[#081F45] text-white border-[#081F45] shadow-md'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-[#081F45]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center gap-1.5 text-xs">
                            <span>🔬</span>
                            <span>مقيم علمي (Peer Reviewer)</span>
                          </span>
                          {regRole === 'reviewer' && <span className="text-[#C79A3D] text-xs font-extrabold">✓ تم الاختيار</span>}
                        </div>
                        <p className={`text-[11px] ${regRole === 'reviewer' ? 'text-slate-200' : 'text-slate-500'}`}>
                          تقييم الأبحاث المحالة وتحديد الصلاحية العلمية للنشر وإبداء الملاحظات.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Name & Academic Title *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Prof. Dr. Mohammed Al-Jubouri" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Academic Email *
                      </label>
                      <input 
                        type="email" 
                        required 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="m.aljubouri@uobaghdad.edu.iq" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900 font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Username *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="m.aljubouri" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900 font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Institution / University
                      </label>
                      <input 
                        type="text" 
                        value={regInstitution}
                        onChange={(e) => setRegInstitution(e.target.value)}
                        placeholder="University of Baghdad - College of Medicine" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Specialty / Field
                      </label>
                      <input 
                        type="text" 
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                        placeholder="Medical Microbiology & Parasitology" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Password *
                      </label>
                      <input 
                        type="password" 
                        required 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900" 
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input 
                        type="password" 
                        required 
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-xs bg-white text-slate-900" 
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-extrabold rounded-xs transition-colors uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-2 mt-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Register Account</span>
                  </button>

                  <div className="text-center pt-2 text-xs border-t border-slate-100">
                    <span className="text-slate-500">Already have an account? </span>
                    <button 
                      type="button"
                      onClick={() => setActivePage('login')}
                      className="text-[#184A87] font-bold hover:underline"
                    >
                      Sign In to Your Account
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* DIRECTORY OF ALL REVIEWERS CREDENTIALS */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 max-w-4xl w-full text-left space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold font-playfair text-[#081F45] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#C79A3D]" />
                    <span>Accredited Reviewers Directory & Login Credentials</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any reviewer account to log in as a peer reviewer and manage assigned evaluations.
                  </p>
                </div>
                <span className="text-[11px] bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-xs">
                  {REVIEWER_ACCOUNTS.length} Reviewers Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {REVIEWER_ACCOUNTS.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xs space-y-2 hover:border-[#081F45] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#081F45]">{rev.name}</div>
                        <div className="text-[10px] text-purple-800 font-semibold">{rev.specialty}</div>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">
                        ID: {rev.reviewerId}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-xs border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5">
                      <div><strong className="text-slate-500">Username/Email:</strong> {rev.email}</div>
                      <div><strong className="text-slate-500">Password:</strong> <span className="text-emerald-700 font-bold">{rev.password}</span></div>
                    </div>

                    <button
                      onClick={() => {
                        setLoginInputEmail(rev.email);
                        setLoginInputPassword(rev.password);
                        setActivePage('login');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="w-full py-1.5 bg-slate-200 hover:bg-[#081F45] hover:text-[#C79A3D] text-slate-800 font-bold text-xs rounded-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Fill Credentials for ({rev.name.split(' ').pop()})</span>
                    </button>
                  </div>
                ))}
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
        currentUser={currentUser}
        onNavigateToAuth={() => {
          setAuthNotice('📝 يرجى تسجيل حساب جديد أو تسجيل الدخول أولاً للتمكن من تقديم ورفع البحث.');
          setActivePage('register');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmailReceipt={(sub) => {
          setEmailReceiptSubmission(sub);
          setIsEmailReceiptOpen(true);
        }}
        onOpenTrackStatus={(query) => {
          setTrackInitialQuery(query);
          setIsTrackModalOpen(true);
        }}
      />

      <TrackManuscriptModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        submissions={submissions}
        initialSearchQuery={trackInitialQuery}
      />

      <EmailReceiptModal
        isOpen={isEmailReceiptOpen}
        onClose={() => setIsEmailReceiptOpen(false)}
        submission={emailReceiptSubmission}
        onOpenTrackModal={(query) => {
          setTrackInitialQuery(query);
          setIsTrackModalOpen(true);
        }}
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
        onOpenSubmitModal={handleOpenSubmitModal}
      />
    </div>
  );
}
