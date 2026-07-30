export type ArticleType = 
  | 'Original Research'
  | 'Systematic Review'
  | 'Meta-Analysis'
  | 'Case Report'
  | 'Short Communication'
  | 'Review Article'
  | 'Editorial';

export interface Author {
  name: string;
  affiliation: string;
  email: string;
  orcid?: string;
  isCorresponding?: boolean;
}

export interface ArticleFigure {
  id: string;
  caption: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  keywords: string[];
  articleType: ArticleType;
  scope: string;
  volume: number;
  issue: number;
  year: number;
  publicationDate: string;
  receivedDate: string;
  acceptedDate: string;
  doi: string;
  downloads: number;
  views: number;
  citations: number;
  pdfUrl: string;
  coverImage?: string;
  htmlContent: string;
  xmlContent: string;
  figures: ArticleFigure[];
  references: string[];
  isEditorChoice?: boolean;
}

export type BoardRole = 
  | 'Editor-in-Chief'
  | 'Managing Editor'
  | 'Associate Editor'
  | 'Section Editor'
  | 'Editorial Board Member'
  | 'International Advisory Board';

export interface EditorialBoardMember {
  id: string;
  name: string;
  title: string;
  role: BoardRole;
  institution: string;
  country: string;
  photoUrl: string;
  orcid?: string;
  researchInterests: string[];
  email: string;
  biography?: string;
}

export interface JournalIssue {
  volume: number;
  issue: number;
  year: number;
  month: 'March' | 'June' | 'September' | 'December';
  publicationDate: string;
  coverImage: string;
  editorNote: string;
  articlesCount: number;
  status: 'Published' | 'Current' | 'Upcoming';
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Call for Papers' | 'Latest Issue' | 'Special Issue' | 'Reviewer Invitation' | 'Editorial News' | 'Conference News';
  content: string;
  linkText?: string;
  isUrgent?: boolean;
}

export interface AssignedReviewer {
  id: string;
  name: string;
  institution: string;
  email: string;
  specialty: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Declined';
  recommendation?: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  dueDate?: string;
}

export interface EditorialLog {
  date: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface SubmissionRecord {
  id: string;
  trackingCode: string;
  title: string;
  articleType: ArticleType;
  scope: string;
  correspondingAuthor: string;
  authorEmail: string;
  institution?: string;
  submissionDate: string;
  status: 'Submitted' | 'Initial Check' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Rejected' | 'Published';
  fileName?: string;
  abstract?: string;
  keywords?: string[];
  assignedReviewers?: AssignedReviewer[];
  decisionNotes?: string;
  rejectionReason?: string;
  logs?: EditorialLog[];
}

export type ActivePage = 
  | 'home'
  | 'about'
  | 'aim-scope'
  | 'current-issue'
  | 'archives'
  | 'articles'
  | 'editorial-board'
  | 'for-authors'
  | 'reviewer-guidelines'
  | 'ethics'
  | 'indexing'
  | 'announcements'
  | 'contact'
  | 'search'
  | 'dashboard'
  | 'login'
  | 'register';
