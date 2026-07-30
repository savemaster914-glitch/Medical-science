import React, { useState } from 'react';
import { JournalLogo } from './JournalLogo';
import { ActivePage } from '../types';
import { 
  Search, 
  Send, 
  Menu, 
  X, 
  User, 
  LogIn, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Users, 
  Layers, 
  HelpCircle, 
  Bell, 
  Award,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenSubmitModal: () => void;
  onOpenSearchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenSubmitModal,
  onOpenSearchModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs font-sans">
      {/* Top Banner: Frequency & Access Metadata Bar */}
      <div className="bg-[#081F45] text-white text-[11px] py-1 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-[#184A87]">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="flex items-center gap-1.5 text-[#C79A3D] font-bold uppercase tracking-wider text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C79A3D] animate-pulse"></span>
            Quarterly Peer-Reviewed Open Access
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-200 text-[10px] uppercase tracking-wider">
            Issues: March • June • September • December
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[10px] font-mono">
          <span className="hidden sm:inline">ISSN: 2958-8421 (Online)</span>
          <span className="hidden sm:inline">DOI: 10.58920/imjb</span>
          <button 
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-1.5 bg-[#C79A3D]/20 text-[#C79A3D] px-2.5 py-0.5 rounded-xs hover:bg-[#C79A3D] hover:text-[#081F45] transition-all font-sans text-[11px] font-bold border border-[#C79A3D]/40 ${activePage === 'dashboard' ? 'bg-[#C79A3D] text-[#081F45]' : ''}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة الأدمن (Admin Panel)</span>
          </button>
        </div>
      </div>

      {/* Primary Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Journal Emblem & Branding */}
        <button 
          onClick={() => handleNavClick('home')}
          className="text-left focus:outline-none group"
        >
          <JournalLogo size="sm" />
        </button>

        {/* Right Action Trigger Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#081F45] bg-slate-100 hover:bg-[#081F45] hover:text-white border border-slate-300 rounded-sm transition-all shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C79A3D]" />
            <span>لوحة الأدمن / Admin</span>
          </button>

          <button
            onClick={() => handleNavClick('login')}
            className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#081F45] hover:bg-slate-100 border border-slate-300 rounded-sm transition-colors"
          >
            Login
          </button>

          <button
            onClick={onOpenSubmitModal}
            className="flex items-center gap-1.5 bg-[#C79A3D] hover:bg-[#b08835] text-[#081F45] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-sm shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Submit Manuscript</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-1.5">
          <button
            onClick={onOpenSearchModal}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-sm"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#081F45] hover:bg-slate-100 rounded-sm"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Integrated High-Density Secondary Navigation Bar */}
      <div className="bg-[#081F45] text-white border-t border-[#184A87]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          <nav className="hidden lg:flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider py-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'home' 
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]' 
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                  ['about', 'aim-scope', 'ethics', 'indexing'].includes(activePage)
                    ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>About Journal</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 top-full pt-1 w-52 hidden group-hover:block z-50">
                <div className="bg-white border border-slate-200 rounded-sm shadow-lg py-1 text-xs text-slate-800 normal-case font-sans">
                  <button
                    onClick={() => handleNavClick('about')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    Journal Information
                  </button>
                  <button
                    onClick={() => handleNavClick('aim-scope')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    Aim & Scope
                  </button>
                  <button
                    onClick={() => handleNavClick('ethics')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    Publication Ethics
                  </button>
                  <button
                    onClick={() => handleNavClick('indexing')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    Indexing & Databases
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('current-issue')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'current-issue'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Current Issue
            </button>

            <button
              onClick={() => handleNavClick('archives')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'archives'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Archives
            </button>

            <button
              onClick={() => handleNavClick('articles')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'articles'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Articles
            </button>

            <button
              onClick={() => handleNavClick('editorial-board')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'editorial-board'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Editorial Board
            </button>

            {/* Guidelines Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm transition-colors ${
                  ['for-authors', 'reviewer-guidelines'].includes(activePage)
                    ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Guidelines</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute left-0 top-full pt-1 w-52 hidden group-hover:block z-50">
                <div className="bg-white border border-slate-200 rounded-sm shadow-lg py-1 text-xs text-slate-800 normal-case font-sans">
                  <button
                    onClick={() => handleNavClick('for-authors')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    For Authors & Formatting
                  </button>
                  <button
                    onClick={() => handleNavClick('reviewer-guidelines')}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-[#081F45]"
                  >
                    Reviewer Guidelines
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('announcements')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'announcements'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Announcements
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                activePage === 'contact'
                  ? 'bg-[#184A87] text-[#C79A3D] font-bold border-b-2 border-[#C79A3D]'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Quick Search Bar Inline */}
          <div className="py-1 flex items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                onClick={onOpenSearchModal}
                placeholder="Search articles, DOIs, authors..."
                className="bg-[#184A87] text-white placeholder-slate-300 text-[11px] px-2.5 py-1 pr-7 rounded-sm border border-[#205ca7] focus:outline-none focus:ring-1 focus:ring-[#C79A3D] cursor-pointer w-48 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-300 absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center justify-center gap-2 bg-[#081F45] text-[#C79A3D] font-bold py-2.5 rounded-md shadow text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة الأدمن Admin</span>
            </button>
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center justify-center gap-2 bg-[#C79A3D] text-[#081F45] font-bold py-2.5 rounded-md shadow text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Submit Manuscript</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              About Journal
            </button>
            <button
              onClick={() => handleNavClick('current-issue')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Current Issue
            </button>
            <button
              onClick={() => handleNavClick('archives')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Archives
            </button>
            <button
              onClick={() => handleNavClick('articles')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Articles
            </button>
            <button
              onClick={() => handleNavClick('editorial-board')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Editorial Board
            </button>
            <button
              onClick={() => handleNavClick('aim-scope')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Aim & Scope
            </button>
            <button
              onClick={() => handleNavClick('for-authors')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              For Authors
            </button>
            <button
              onClick={() => handleNavClick('reviewer-guidelines')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Reviewer Guidelines
            </button>
            <button
              onClick={() => handleNavClick('ethics')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Publication Ethics
            </button>
            <button
              onClick={() => handleNavClick('indexing')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Indexing
            </button>
            <button
              onClick={() => handleNavClick('announcements')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Announcements
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-800"
            >
              Contact
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="text-left px-3 py-2 rounded hover:bg-slate-100 text-[#081F45] font-bold"
            >
              Author/Reviewer Portal
            </button>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <button
              onClick={() => handleNavClick('login')}
              className="flex-1 py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded"
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="flex-1 py-2 text-center text-sm font-semibold text-white bg-[#081F45] rounded"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
