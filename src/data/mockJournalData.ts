import { Article, EditorialBoardMember, JournalIssue, Announcement } from '../types';

export const JOURNAL_INFO = {
  name: "Iraqi Journal of Biomedical and Clinical Medicine",
  abbreviation: "IJBCM",
  publisher: "Department of Medical Laboratories",
  institution: "Al-Habbobi Teaching Hospital",
  directorate: "Thi-Qar Health Directorate",
  location: "Dhi Qar, Iraq",
  country: "Iraq",
  frequency: "Quarterly Journal (Published four issues annually: March, June, September, December)",
  frequencyShort: "Quarterly",
  months: ["March", "June", "September", "December"],
  language: "English",
  access: "Open Access (CC BY 4.0)",
  peerReview: "Double-Blind Peer Review",
  issnOnline: "2958-8421",
  issnPrint: "2958-8413",
  doiPrefix: "10.58920/imjb",
  license: "Creative Commons Attribution 4.0 International (CC BY 4.0)",
  apc: "$150 USD (Full Waivers Automatically Granted for Iraqi Institutional Authors & Low-Income Regions)",
  contactEmail: "editor@imjb-iq.org",
  supportEmail: "support@imjb-iq.org",
  phone: "+964 780 123 4567",
  establishedYear: 2023,
};

export const SCOPE_CATEGORIES = [
  { name: "Clinical Medicine", count: 142, icon: "Stethoscope" },
  { name: "Medical Laboratory Science", count: 218, icon: "FlaskConical" },
  { name: "Pathology & Histopathology", count: 98, icon: "Microscope" },
  { name: "Clinical Chemistry", count: 114, icon: "Dna" },
  { name: "Medical Microbiology & Virology", count: 165, icon: "Bug" },
  { name: "Immunology & Serology", count: 132, icon: "ShieldCheck" },
  { name: "Cancer Biology & Oncology", count: 104, icon: "Activity" },
  { name: "Molecular Diagnostics (PCR/ELISA)", count: 189, icon: "Binary" },
  { name: "Hematology & Blood Banking", count: 156, icon: "Droplet" },
  { name: "Parasitology & Mycology", count: 76, icon: "Biohazard" },
  { name: "Medical Genetics & Genomics", count: 91, icon: "Dna" },
  { name: "Biochemistry & Endocrinology", count: 110, icon: "Flame" },
  { name: "Artificial Intelligence in Medicine", count: 64, icon: "Cpu" },
  { name: "Precision & Translational Medicine", count: 83, icon: "Target" },
  { name: "Stem Cell Research & Regenerative", count: 47, icon: "Sparkles" },
  { name: "Public Health & Epidemiology", count: 125, icon: "Globe" }
];

export const MOCK_ISSUES: JournalIssue[] = [
  {
    volume: 4,
    issue: 1,
    year: 2026,
    month: 'March',
    publicationDate: 'March 30, 2026',
    coverImage: '/src/assets/images/issue_cover_march_1785437394005.jpg',
    editorNote: 'This issue highlights breakthroughs in real-time PCR molecular screening for tropical parasitic diseases, novel hematologic markers in Southern Iraq, and AI applications in histopathology.',
    articlesCount: 14,
    status: 'Current'
  },
  {
    volume: 3,
    issue: 4,
    year: 2025,
    month: 'December',
    publicationDate: 'December 28, 2025',
    coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    editorNote: 'Special focus on antimicrobial resistance patterns in clinical isolates from tertiary teaching hospitals across Iraq.',
    articlesCount: 16,
    status: 'Published'
  },
  {
    volume: 3,
    issue: 3,
    year: 2025,
    month: 'September',
    publicationDate: 'September 25, 2025',
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    editorNote: 'Advances in clinical immunology and autoimmune diagnostic assays.',
    articlesCount: 15,
    status: 'Published'
  },
  {
    volume: 3,
    issue: 2,
    year: 2025,
    month: 'June',
    publicationDate: 'June 29, 2025',
    coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    editorNote: 'Epidemiological surveillance of blood-borne pathogens and viral hepatitis in Dhi Qar province.',
    articlesCount: 18,
    status: 'Published'
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: "imjb-2026-0401-01",
    title: "Molecular Typing and Antibiotic Resistance Profiling of Clinical Acinetobacter baumannii Isolates from Al-Habbobi Teaching Hospital, Dhi Qar, Iraq",
    articleType: "Original Research",
    scope: "Medical Microbiology & Virology",
    volume: 4,
    issue: 1,
    year: 2026,
    publicationDate: "2026-03-15",
    receivedDate: "2026-01-10",
    acceptedDate: "2026-02-28",
    doi: "10.58920/imjb.2026.0401.01",
    downloads: 1420,
    views: 3850,
    citations: 12,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1583912267670-657592e316d2?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: true,
    authors: [
      { name: "Dr. Ahmed Hassan Al-Rikabi", affiliation: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "a.rikabi@habbobi-med.iq", orcid: "0000-0002-8419-3301", isCorresponding: true },
      { name: "Prof. Zahra K. Al-Khafaji", affiliation: "College of Medicine, University of Thi-Qar, Nassiriya, Iraq", email: "z.khafaji@utq.edu.iq", orcid: "0000-0001-9204-7721" },
      { name: "Dr. Marcus Vance", affiliation: "Institute of Infection and Global Health, University of Liverpool, UK", email: "m.vance@liverpool.ac.uk", orcid: "0000-0003-4109-8812" }
    ],
    abstract: "Acinetobacter baumannii is a major cause of healthcare-associated infections worldwide, exhibiting formidable multidrug resistance (MDR) mechanisms. This study investigated the molecular characterization and carbapenem resistance genes (blaOXA-23-like, blaOXA-24-like, blaIMP, and blaNDM) among 114 clinical isolates recovered from intensive care units and burn wards at Al-Habbobi Teaching Hospital over a 12-month period. Multiplex real-time PCR demonstrated that 78.9% of isolates harbored the blaOXA-23-like gene, while 24.5% possessed blaNDM-1. Susceptibility testing revealed alarmingly high resistance rates to imipenem (84.2%) and meropenem (86.0%), whereas colistin retained 96.5% susceptibility. Pulsed-field gel electrophoresis (PFGE) identified three dominant clonal lineages circulating within hospital wards. These findings underscore the imperative for strict infection control compliance and continuous molecular surveillance in southern Iraqi tertiary medical centers.",
    keywords: ["Acinetobacter baumannii", "Multidrug Resistance", "blaOXA-23", "blaNDM-1", "Al-Habbobi Teaching Hospital", "Molecular Diagnostics", "Iraq"],
    figures: [
      { id: "fig1", caption: "Figure 1: Agarose gel electrophoresis showing PCR amplification of blaOXA-23 (501 bp) and blaNDM-1 (621 bp) genes.", url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80" },
      { id: "fig2", caption: "Figure 2: Antimicrobial susceptibility profiles of 114 A. baumannii clinical isolates.", url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" }
    ],
    references: [
      "Al-Khafaji ZK, et al. Prevalence of carbapenemase-producing Gram-negative bacilli in Southern Iraq hospitals. J Hosp Infect. 2024;118:45-53.",
      "Nordmann P, Poirel L. Epidemiology and diagnostics of carbapenem resistance in Gram-negative bacteria. Clin Microbiol Infect. 2019;25(9):1071-1079.",
      "Ministry of Health Iraq. National Surveillance Guidelines for Antimicrobial Resistance 2025 Edition. Baghdad, Iraq."
    ],
    htmlContent: `
      <h3>Introduction</h3>
      <p>Healthcare-associated infections (HAIs) caused by multidrug-resistant (MDR) <em>Acinetobacter baumannii</em> represent an urgent global public health threat, particularly in intensive care units (ICUs) and specialized burn centers. In Iraq, environmental challenges, high patient turnover, and empirical antibiotic administration have accelerated the dissemination of carbapenem-resistant <em>A. baumannii</em> (CRAB) strains.</p>
      <h3>Materials and Methods</h3>
      <p>A cross-sectional analytical study was conducted between January 2025 and January 2026 at the Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Thi-Qar, Iraq. A total of 114 non-duplicate <em>A. baumannii</em> clinical specimens (sputum, wound swabs, blood, urine) were collected and identified using VITEK 2 Compact automated system and 16S-23S rRNA gene intergenic spacer PCR confirmation.</p>
      <h3>Results</h3>
      <p>All isolates demonstrated high resistance to third-generation cephalosporins and fluoroquinolones (>90%). Carbapenem resistance was documented in 98 isolates (86.0%). Molecular screening revealed the predominance of <em>blaOXA-23-like</em> gene in 90 isolates (78.9%), followed by <em>blaOXA-24-like</em> in 31 isolates (27.2%), and <em>blaNDM-1</em> in 28 isolates (24.5%). Co-harboring of carbapenemase genes was observed in 34.2% of CRAB strains.</p>
      <h3>Discussion & Clinical Significance</h3>
      <p>The high frequency of <em>blaOXA-23</em> and the emergence of <em>blaNDM-1</em> metallo-β-lactamase in Al-Habbobi Teaching Hospital represent a critical epidemiologic warning. Routine PCR molecular screening is recommended upon ICU admission to isolate carriers and limit horizontal gene transfer.</p>
    `,
    xmlContent: `<?xml version="1.0" encoding="UTF-8"?>
<article xmlns:mml="http://www.w3.org/1998/Math/MathML" xmlns:xlink="http://www.w3.org/1999/xlink" article-type="research-article" dtd-version="1.2" xml:lang="en">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">IJBCM</journal-id>
      <journal-title-group>
        <journal-title>Iraqi Journal of Biomedical and Clinical Medicine</journal-title>
      </journal-title-group>
      <issn pub-type="epub">2958-8421</issn>
      <publisher>
        <publisher-name>Department of Medical Laboratories, Al-Habbobi Teaching Hospital</publisher-name>
      </publisher>
    </journal-meta>
    <article-meta>
      <article-id pub-id-type="doi">10.58920/imjb.2026.0401.01</article-id>
      <title-group>
        <article-title>Molecular Typing and Antibiotic Resistance Profiling of Clinical Acinetobacter baumannii Isolates from Al-Habbobi Teaching Hospital, Dhi Qar, Iraq</article-title>
      </title-group>
    </article-meta>
  </front>
</article>`
  },
  {
    id: "imjb-2026-0401-02",
    title: "Evaluation of Serum MicroRNA-21 and MicroRNA-155 Expression Levels as Diagnostic Biomarkers for Early-Stage Colorectal Carcinoma in Iraqi Patients",
    articleType: "Original Research",
    scope: "Cancer Biology & Oncology",
    volume: 4,
    issue: 1,
    year: 2026,
    publicationDate: "2026-03-18",
    receivedDate: "2026-01-18",
    acceptedDate: "2026-03-02",
    doi: "10.58920/imjb.2026.0401.02",
    downloads: 980,
    views: 2640,
    citations: 8,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: true,
    authors: [
      { name: "Dr. Fatima Majeed Al-Zaidi", affiliation: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "f.zaidi@habbobi-med.iq", orcid: "0000-0003-1102-4418", isCorresponding: true },
      { name: "Dr. Haider S. Al-Mousawi", affiliation: "Oncology Center, Al-Hussein Teaching Hospital, Dhi Qar, Iraq", email: "h.mousawi@thiqar-health.gov.iq", orcid: "0000-0002-9844-3109" },
      { name: "Prof. Elena Rossi", affiliation: "Department of Molecular Medicine, Sapienza University of Rome, Italy", email: "elena.rossi@uniroma1.it", orcid: "0000-0001-5092-2299" }
    ],
    abstract: "Colorectal carcinoma (CRC) is an increasingly prevalent malignancy in Iraq, often diagnosed at advanced stages due to non-specific early clinical presentations. Non-invasive circulating microRNA biomarkers hold significant promise for early detection. We measured serum miR-21 and miR-155 expression levels using Quantitative Reverse Transcription PCR (qRT-PCR) in 85 biopsy-confirmed CRC patients (Stage I-IV), 45 patients with benign colorectal polyps, and 60 age- and sex-matched healthy controls. Serum miR-21 expression was significantly upregulated in CRC patients compared to healthy controls (fold change = 5.82, p < 0.001), while miR-155 demonstrated a 3.94-fold increase. Receiver Operating Characteristic (ROC) curve analysis revealed an Area Under Curve (AUC) of 0.914 for miR-21 and 0.865 for miR-155 in differentiating Stage I/II CRC from controls. Combining miR-21 and miR-155 achieved a diagnostic sensitivity of 91.8% and specificity of 88.3%. These findings demonstrate that circulating serum miR-21 and miR-155 represent robust, minimally invasive diagnostic biomarkers for early CRC detection in the Iraqi population.",
    keywords: ["Colorectal Carcinoma", "microRNA-21", "microRNA-155", "Liquid Biopsy", "qRT-PCR", "Biomarkers", "Al-Habbobi Teaching Hospital"],
    figures: [
      { id: "fig1", caption: "Figure 1: Relative serum fold expression of miR-21 and miR-155 across clinical stages of colorectal cancer.", url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80" }
    ],
    references: [
      "Slattery ML, et al. MicroRNAs and colorectal cancer risk. Cancer Epidemiol Biomarkers Prev. 2023;32(4):489-498.",
      "Al-Zaidi FM, et al. Molecular pathology of gastrointestinal malignancies in Southern Iraq. Eastern Med Health J. 2025;31(2):112-120."
    ],
    htmlContent: `
      <h3>Introduction</h3>
      <p>Colorectal cancer ranks among the top three leading causes of cancer mortality in Iraq. Early detection prior to distant metastasis dramatically improves 5-year overall survival rates from 14% to over 90%.</p>
      <h3>Results</h3>
      <p>qRT-PCR analysis confirmed strong over-expression of both microRNAs. High miR-21 levels correlated significantly with lymph node involvement (p = 0.008) and vascular invasion.</p>
    `,
    xmlContent: `<?xml version="1.0" encoding="UTF-8"?><article></article>`
  },
  {
    id: "imjb-2026-0401-03",
    title: "Prevalence of Hemoglobinopathies and Beta-Thalassemia Trait Screening Among Premarital Couples in Thi-Qar Governorate: A 5-Year Retrospective Laboratory Audit",
    articleType: "Original Research",
    scope: "Hematology & Blood Banking",
    volume: 4,
    issue: 1,
    year: 2026,
    publicationDate: "2026-03-20",
    receivedDate: "2026-01-22",
    acceptedDate: "2026-03-05",
    doi: "10.58920/imjb.2026.0401.03",
    downloads: 1650,
    views: 4200,
    citations: 19,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: false,
    authors: [
      { name: "Dr. Mustafa Jassim Al-Sudani", affiliation: "Center for Hereditary Blood Disorders, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "m.sudani@habbobi-med.iq", orcid: "0000-0002-4410-9011", isCorresponding: true },
      { name: "Dr. Layla N. Al-Ameri", affiliation: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "l.ameri@habbobi-med.iq", orcid: "0000-0003-8890-1203" }
    ],
    abstract: "Premarital screening programs represent the cornerstone of primary prevention for severe hemoglobinopathies, particularly beta-thalassemia major and sickle cell disease (SCD), which impose substantial health burdens in the Middle East. This retrospective audit examined laboratory records of 42,680 individuals (21,340 couples) undergoing mandatory premarital screening at the Center for Hereditary Blood Disorders, Al-Habbobi Teaching Hospital, between 2021 and 2025. Automated High-Performance Liquid Chromatography (HPLC) coupled with complete blood counts (CBC) was performed. Beta-thalassemia trait (HbA2 > 3.5%) was identified in 4.82% of screened individuals, while Sickle Cell trait (HbS) was detected in 1.45%. A total of 184 couples (0.86%) were identified as high-risk at-risk pairs (both partners carrying abnormal hemoglobin traits). Genetic counseling interventions successfully prevented high-risk marriages in 72.4% of informed couples. Continuous screening expansion and public awareness campaigns are vital to minimizing new thalassemic births in Iraq.",
    keywords: ["Beta-Thalassemia Trait", "Hemoglobinopathies", "Premarital Screening", "HPLC", "Thi-Qar", "Sickle Cell Trait", "Public Health"],
    figures: [],
    references: [],
    htmlContent: `<p>Comprehensive statistical breakdown of premarital screening protocols in Southern Iraq.</p>`,
    xmlContent: `<article></article>`
  },
  {
    id: "imjb-2026-0401-04",
    title: "Diagnostic Efficacy of Real-Time PCR vs. Conventional Microscopic Examinations in Cutaneous Leishmaniasis Isolates in Dhi Qar Marshlands",
    articleType: "Original Research",
    scope: "Parasitology & Mycology",
    volume: 4,
    issue: 1,
    year: 2026,
    publicationDate: "2026-03-22",
    receivedDate: "2026-01-28",
    acceptedDate: "2026-03-08",
    doi: "10.58920/imjb.2026.0401.04",
    downloads: 740,
    views: 1980,
    citations: 5,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: false,
    authors: [
      { name: "Dr. Hussein Ali Al-Saffar", affiliation: "Department of Parasitology & Tropical Diseases, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "h.saffar@habbobi-med.iq", orcid: "0000-0001-7712-8840", isCorresponding: true },
      { name: "Dr. Nawal K. Al-Husseini", affiliation: "College of Science, University of Thi-Qar, Iraq", email: "n.husseini@utq.edu.iq" }
    ],
    abstract: "Cutaneous Leishmaniasis (CL) remains an endemic zoonotic disease in the Southern Iraqi Marshlands (Al-Chibayish and Al-Fuhood districts). Traditional Giemsa-stained skin scraping microscopy often yields false negatives in chronic or ulcerated lesions. We evaluated 160 patient skin lesions using conventional microscopy, culture in Novy-MacNeal-Nicolle (NNN) medium, and kDNA-targeted real-time PCR. Real-time PCR demonstrated superior sensitivity (96.3%) compared to microscopy (68.1%) and NNN culture (54.4%). Species identification via restriction fragment length polymorphism (RFLP) confirmed Leishmania major in 78.2% and Leishmania tropica in 21.8% of positive cases.",
    keywords: ["Cutaneous Leishmaniasis", "Leishmania major", "Real-Time PCR", "kDNA", "Giemsa Microscopy", "Thi-Qar Marshlands"],
    figures: [],
    references: [],
    htmlContent: `<p>Field diagnostic study comparing molecular amplification with traditional parasite staining techniques.</p>`,
    xmlContent: `<article></article>`
  },
  {
    id: "imjb-2026-0401-05",
    title: "Application of Deep Neural Network Algorithms for Automated Histopathological Grading of Invasive Breast Carcinoma in Digital Slide Images",
    articleType: "Original Research",
    scope: "Artificial Intelligence in Medicine",
    volume: 4,
    issue: 1,
    year: 2026,
    publicationDate: "2026-03-24",
    receivedDate: "2026-02-01",
    acceptedDate: "2026-03-10",
    doi: "10.58920/imjb.2026.0401.05",
    downloads: 1290,
    views: 3100,
    citations: 14,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: true,
    authors: [
      { name: "Dr. Salam N. Al-Gharbawi", affiliation: "Department of Pathology, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "s.gharbawi@habbobi-med.iq", orcid: "0000-0003-4589-9920", isCorresponding: true },
      { name: "Dr. Karrar M. Al-Rubaye", affiliation: "Department of Computer Engineering, University of Thi-Qar, Iraq", email: "k.rubaye@utq.edu.iq" },
      { name: "Prof. Hans-Peter Mueller", affiliation: "Department of Pathology, Charité - Universitätsmedizin Berlin, Germany", email: "hp.mueller@charite.de" }
    ],
    abstract: "Accurate Nottingham histopathological grading of invasive ductal carcinoma of the breast is essential for prognostic evaluation and therapeutic decision-making. However, inter-observer variability among pathologists remains a clinical challenge. We developed and validated a convolutional neural network (ResNet-50 architecture) trained on 2,400 whole slide digital images (WSI) obtained from Iraqi breast cancer biopsies. The deep learning model achieved an overall accuracy of 94.2% in classifying tubule formation, nuclear pleomorphism, and mitotic counts compared to expert consensus histopathology.",
    keywords: ["Artificial Intelligence", "Digital Pathology", "Breast Cancer", "Deep Learning", "Convolutional Neural Network", "Nottingham Grade"],
    figures: [],
    references: [],
    htmlContent: `<p>Validation of machine learning vision architectures in routine pathology workflow.</p>`,
    xmlContent: `<article></article>`
  },
  {
    id: "imjb-2025-0304-01",
    title: "Seroprevalence and Molecular Detection of Human Cytomegalovirus (HCMV) in Pregnant Women with Recurrent Spontaneous Abortion in Thi-Qar Governorate",
    articleType: "Original Research",
    scope: "Immunology & Serology",
    volume: 3,
    issue: 4,
    year: 2025,
    publicationDate: "2025-12-28",
    receivedDate: "2025-10-15",
    acceptedDate: "2025-12-10",
    doi: "10.58920/imjb.2025.0304.01",
    downloads: 1890,
    views: 4500,
    citations: 22,
    pdfUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    isEditorChoice: false,
    authors: [
      { name: "Dr. Sundus A. Al-Mayahi", affiliation: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Dhi Qar, Iraq", email: "s.mayahi@habbobi-med.iq", isCorresponding: true }
    ],
    abstract: "Human Cytomegalovirus (HCMV) is a primary infectious cause of congenital neurological impairment and pregnancy loss. This study investigated HCMV IgM/IgG seroprevalence via ELISA and viral load using quantitative real-time PCR in 210 pregnant women experiencing recurrent pregnancy loss.",
    keywords: ["Human Cytomegalovirus", "HCMV", "Recurrent Abortion", "ELISA", "qPCR", "Maternal Health"],
    figures: [],
    references: [],
    htmlContent: `<p>Maternal infectious disease serosurvey in southern Iraq.</p>`,
    xmlContent: `<article></article>`
  }
];

export const MOCK_EDITORIAL_BOARD: EditorialBoardMember[] = [
  {
    id: "eb-01",
    name: "Prof. Dr. Tariq H. Al-ThiQari, MD, PhD",
    title: "Professor of Molecular Pathology & Laboratory Medicine",
    role: "Editor-in-Chief",
    institution: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital & College of Medicine, University of Thi-Qar",
    country: "Iraq",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0002-1920-4819",
    researchInterests: ["Molecular Oncology", "Histopathology", "Diagnostic Biomarkers", "Laboratory Quality Management"],
    email: "editor-in-chief@imjb-iq.org",
    biography: "Prof. Al-ThiQari has over 28 years of clinical and academic experience in laboratory medicine. He pioneered molecular diagnostic protocols at Al-Habbobi Teaching Hospital and has published over 90 peer-reviewed papers."
  },
  {
    id: "eb-02",
    name: "Dr. Ahmed Hassan Al-Rikabi, PhD",
    title: "Senior Consultant in Clinical Microbiology",
    role: "Managing Editor",
    institution: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital, Thi-Qar",
    country: "Iraq",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0002-8419-3301",
    researchInterests: ["Antimicrobial Resistance", "Bacterial Genomics", "Hospital Infection Control"],
    email: "managing.editor@imjb-iq.org",
    biography: "Dr. Al-Rikabi leads the microbiology reference section at Al-Habbobi Teaching Hospital and coordinates peer review workflow for IMJB."
  },
  {
    id: "eb-03",
    name: "Prof. Dr. Elizabeth Sterling, FRCPath",
    title: "Professor of Hematology & Transfusion Medicine",
    role: "Associate Editor",
    institution: "Oxford University Hospitals NHS Foundation Trust & University of Oxford",
    country: "United Kingdom",
    photoUrl: "https://images.unsplash.com/photo-1594824813566-78a9c3743f54?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0001-8840-2011",
    researchInterests: ["Hemoglobinopathies", "Thalassemia Prevention", "Coagulation Disorders"],
    email: "e.sterling@oxford-health.uk"
  },
  {
    id: "eb-04",
    name: "Prof. Dr. Mahmoud El-Sayed, MD",
    title: "Professor of Clinical Biochemistry",
    role: "Associate Editor",
    institution: "Faculty of Medicine, Cairo University",
    country: "Egypt",
    photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0003-7719-0012",
    researchInterests: ["Endocrine Biomarkers", "Metabolic Syndrome", "Clinical Enzymology"],
    email: "m.elsayed@kasralainy.edu.eg"
  },
  {
    id: "eb-05",
    name: "Dr. Fatima Majeed Al-Zaidi, PhD",
    title: "Consultant Molecular Biologist",
    role: "Section Editor",
    institution: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital",
    country: "Iraq",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0003-1102-4418",
    researchInterests: ["Cancer Genetics", "Circulating microRNAs", "Liquid Biopsy"],
    email: "f.zaidi@habbobi-med.iq"
  },
  {
    id: "eb-06",
    name: "Prof. Dr. Kenji Takahashi, MD, PhD",
    title: "Director of Biomedical Engineering & AI",
    role: "International Advisory Board",
    institution: "Kyoto University Hospital",
    country: "Japan",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0002-4019-8833",
    researchInterests: ["Artificial Intelligence in Medicine", "Deep Learning Pathology", "Image Analysis"],
    email: "k.takahashi@kyoto-u.ac.jp"
  },
  {
    id: "eb-07",
    name: "Dr. Layla N. Al-Ameri, PhD",
    title: "Assistant Professor of Immunology",
    role: "Section Editor",
    institution: "College of Science, University of Thi-Qar",
    country: "Iraq",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0003-8890-1203",
    researchInterests: ["Autoimmunity", "Cytokine Profiling", "Vaccine Immunology"],
    email: "l.ameri@utq.edu.iq"
  },
  {
    id: "eb-08",
    name: "Dr. Christopher Vance, MD",
    title: "Chief of Infectious Disease Laboratory",
    role: "International Advisory Board",
    institution: "Johns Hopkins University School of Medicine",
    country: "United States",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    orcid: "0000-0001-9920-1100",
    researchInterests: ["Emerging Viral Infections", "PCR Assay Validation", "Global Health Security"],
    email: "cvance@jhmi.edu"
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-01",
    title: "Call for Papers: Volume 4, Issue 2 (June 2026) - Deadline: April 30, 2026",
    date: "March 15, 2026",
    category: "Call for Papers",
    content: "The Iraqi Journal of Biomedical and Clinical Medicine (IJBCM) invites high-quality original research articles, review papers, and short communications for the upcoming quarterly issue (Volume 4, Issue 2 - June 2026). Authors are encouraged to submit manuscripts through our online manuscript portal.",
    linkText: "Submit Manuscript Now",
    isUrgent: true
  },
  {
    id: "ann-02",
    title: "Special Issue Announcement: 'Molecular Diagnostics & AI in Tropical & Infectious Diseases'",
    date: "March 10, 2026",
    category: "Special Issue",
    content: "IJBCM announces a dedicated Special Issue focusing on modern molecular diagnostics (qPCR, NGS, CRISPR-Cas) and artificial intelligence applications in managing endemic infectious diseases in the Middle East.",
    linkText: "View Special Issue Details"
  },
  {
    id: "ann-03",
    title: "Volume 4, Issue 1 (March 2026) Now Fully Published & Open Access",
    date: "March 01, 2026",
    category: "Latest Issue",
    content: "We are pleased to announce the full publication of Vol. 4 No. 1 (March 2026), featuring 14 peer-reviewed original research studies with assigned CrossRef DOIs and open-access PDF downloads.",
    linkText: "Explore Current Issue"
  },
  {
    id: "ann-04",
    title: "Invitation for International Peer Reviewers in Pathology, Microbiology & AI",
    date: "February 20, 2026",
    category: "Reviewer Invitation",
    content: "IJBCM is expanding its international reviewer database. Qualified biomedical researchers holding a PhD or MD are invited to register as peer reviewers.",
    linkText: "Register as Reviewer"
  }
];

export const INDEXING_SERVICES = [
  { name: "Google Scholar", category: "Global Citation Index", status: "Indexed & Active", logoText: "Google Scholar" },
  { name: "CrossRef DOI", category: "Digital Object Identifier", status: "Prefix: 10.58920/imjb", logoText: "CrossRef" },
  { name: "DOAJ", category: "Directory of Open Access Journals", status: "Verified OA", logoText: "DOAJ" },
  { name: "Scopus", category: "Elsevier Abstract Database", status: "Evaluation Phase", logoText: "Scopus" },
  { name: "Web of Science", category: "Clarivate Emerging Sources", status: "ESCI Review", logoText: "Web of Science" },
  { name: "Dimensions", category: "Digital Science Citations", status: "Full Content", logoText: "Dimensions" },
  { name: "ROAD", category: "Directory of Open Access Scholarly Resources", status: "Registered", logoText: "ROAD" },
  { name: "OpenAlex", category: "Index of World Knowledge", status: "Harvested", logoText: "OpenAlex" },
  { name: "BASE", category: "Bielefeld Academic Search Engine", status: "Indexed", logoText: "BASE" },
  { name: "Semantic Scholar", category: "AI-Powered Research Tool", status: "Harvested", logoText: "Semantic Scholar" },
  { name: "ORCID", category: "Author Identifier Integration", status: "API Connected", logoText: "ORCID" },
  { name: "Crossmark", category: "Document Update Tracking", status: "Active", logoText: "Crossmark" },
  { name: "CLOCKSS", category: "Digital Archiving Preservation", status: "Archived", logoText: "CLOCKSS" },
  { name: "PKP PN", category: "PKP Preservation Network", status: "Preserved", logoText: "PKP PN" }
];
