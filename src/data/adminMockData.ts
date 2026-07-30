import { SubmissionRecord, AssignedReviewer } from '../types';

export const ACRREDITED_REVIEWERS: AssignedReviewer[] = [
  {
    id: "REV-101",
    name: "Prof. Dr. Tariq Al-Janabi",
    institution: "College of Medicine, University of Baghdad",
    email: "tariq.aljanabi@med.uobaghdad.edu.iq",
    specialty: "Medical Microbiology & Virology",
    status: "Completed",
    recommendation: "Accept"
  },
  {
    id: "REV-102",
    name: "Dr. Fatima H. Al-Rubaie",
    institution: "Department of Medical Laboratories, Al-Habbobi Teaching Hospital",
    email: "fatima.alrubaie@imjb-iq.org",
    specialty: "Pathology & Histopathology",
    status: "Pending",
    dueDate: "April 15, 2026"
  },
  {
    id: "REV-103",
    name: "Dr. Ahmed Jabbar Al-Sarray",
    institution: "Thi-Qar University, College of Pharmacy",
    email: "ahmed.sarray@utq.edu.iq",
    specialty: "Clinical Chemistry & Molecular Biomarkers",
    status: "Accepted",
    dueDate: "April 18, 2026"
  },
  {
    id: "REV-104",
    name: "Dr. Suhad M. Al-Khafaji",
    institution: "Al-Nasiriya General Hospital",
    email: "suhad.khafaji@thi-qar-health.iq",
    specialty: "Hematology & Blood Transfusion Medicine",
    status: "Completed",
    recommendation: "Minor Revision"
  },
  {
    id: "REV-105",
    name: "Prof. Dr. Hassan K. Al-Mahdawi",
    institution: "Mustansiriyah University, College of Science",
    email: "hassan.mahdawi@uomustansiriyah.edu.iq",
    specialty: "Immunology & Serology",
    status: "Pending",
    dueDate: "April 20, 2026"
  },
  {
    id: "REV-106",
    name: "Dr. Zainab Abdul-Amir",
    institution: "Al-Habbobi Teaching Hospital",
    email: "zainab.abdulamir@imjb-iq.org",
    specialty: "Parasitology & Mycology",
    status: "Completed",
    recommendation: "Accept"
  }
];

export const INITIAL_ADMIN_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: "IMJB-2026-SUB-491028",
    trackingCode: "TRK-98401",
    title: "Molecular Detection of Carbapenemase Genes (blaNDM, blaOXA-48) in Clinical Isolates from ICU Wards in Thi-Qar",
    articleType: "Original Research",
    scope: "Medical Microbiology & Virology",
    correspondingAuthor: "Dr. Haider Majeed Al-Zaidi",
    authorEmail: "haider.majeed@utq.edu.iq",
    institution: "Department of Microbiology, College of Medicine, Thi-Qar University",
    submissionDate: "March 18, 2026",
    status: "Under Review",
    fileName: "Manuscript_Haider_AlZaidi_2026.docx",
    abstract: "Carbapenem-resistant Enterobacteriaceae pose a critical healthcare threat in intensive care units. This prospective study evaluated 150 clinical isolates collected from Al-Habbobi Teaching Hospital using multiplex real-time PCR targeting blaNDM and blaOXA-48 resistance determinants.",
    keywords: ["Carbapenemase", "blaNDM", "Real-Time PCR", "Al-Habbobi Hospital", "ICU Isolates"],
    assignedReviewers: [
      {
        id: "REV-101",
        name: "Prof. Dr. Tariq Al-Janabi",
        institution: "University of Baghdad",
        email: "tariq.aljanabi@med.uobaghdad.edu.iq",
        specialty: "Medical Microbiology & Virology",
        status: "Completed",
        recommendation: "Accept"
      },
      {
        id: "REV-103",
        name: "Dr. Ahmed Jabbar Al-Sarray",
        institution: "Thi-Qar University",
        email: "ahmed.sarray@utq.edu.iq",
        specialty: "Clinical Chemistry & Molecular Biomarkers",
        status: "Accepted",
        dueDate: "April 18, 2026"
      }
    ],
    logs: [
      { date: "March 18, 2026", action: "Manuscript Submitted", actor: "Author" },
      { date: "March 19, 2026", action: "Passed Desk Check", actor: "Managing Editor" },
      { date: "March 20, 2026", action: "Assigned 2 Reviewers", actor: "Editor-in-Chief" }
    ]
  },
  {
    id: "IMJB-2026-SUB-381902",
    trackingCode: "TRK-77123",
    title: "Diagnostic Efficacy of Serum miR-21 and miR-155 Biomarkers in Early Colorectal Cancer Screening",
    articleType: "Original Research",
    scope: "Clinical Chemistry",
    correspondingAuthor: "Dr. Salma Kadhim Al-Aboudi",
    authorEmail: "salma.aboudi@uobasrah.edu.iq",
    institution: "College of Medicine, University of Basrah",
    submissionDate: "February 24, 2026",
    status: "Revision Required",
    fileName: "miR21_Colorectal_Basrah.pdf",
    abstract: "Non-invasive circulating microRNA biomarkers show high diagnostic sensitivity for colorectal adenomas. Serum expression levels of miR-21 were quantified by RT-qPCR in 80 histopathologically confirmed cases.",
    keywords: ["microRNA", "miR-21", "Colorectal Cancer", "Biomarkers", "RT-qPCR"],
    assignedReviewers: [
      {
        id: "REV-104",
        name: "Dr. Suhad M. Al-Khafaji",
        institution: "Al-Nasiriya General Hospital",
        email: "suhad.khafaji@thi-qar-health.iq",
        specialty: "Hematology & Blood Transfusion Medicine",
        status: "Completed",
        recommendation: "Minor Revision"
      }
    ],
    decisionNotes: "Authors must clarify the ROC curve statistical thresholds in Figure 3 and address inter-assay coefficient variations.",
    logs: [
      { date: "February 24, 2026", action: "Manuscript Submitted", actor: "Author" },
      { date: "March 02, 2026", action: "Peer Review Completed", actor: "Reviewers" },
      { date: "March 05, 2026", action: "Minor Revisions Requested", actor: "Editor-in-Chief" }
    ]
  },
  {
    id: "IMJB-2026-SUB-512903",
    trackingCode: "TRK-10294",
    title: "Epidemiological Surveillance and Seroprevalence of Hepatitis B Virus Surface Antigen Among Blood Donors",
    articleType: "Short Communication",
    scope: "Public Health & Epidemiology",
    correspondingAuthor: "Dr. Mustafa Nadhim Al-Mansouri",
    authorEmail: "mustafa.mansouri@thi-qar-health.iq",
    institution: "Dhi Qar Central Blood Bank",
    submissionDate: "March 28, 2026",
    status: "Submitted",
    fileName: "HBV_Donors_ThiQar_2026.docx",
    abstract: "Screening of 12,400 blood donors at Dhi Qar Central Blood Bank revealed HBsAg positivity rate of 0.42%. Chemiluminescent immunoassay (CLIA) confirmation was conducted for all reactive donors.",
    keywords: ["Hepatitis B", "Blood Donors", "Seroprevalence", "Thi-Qar Blood Bank"],
    assignedReviewers: [],
    logs: [
      { date: "March 28, 2026", action: "Manuscript Submitted", actor: "Author" }
    ]
  },
  {
    id: "IMJB-2026-SUB-104921",
    trackingCode: "TRK-55410",
    title: "Comparative Histopathological Pattern of Renal Cell Carcinoma Subtypes: A 5-Year Retrospective Study in Southern Iraq",
    articleType: "Original Research",
    scope: "Pathology & Histopathology",
    correspondingAuthor: "Dr. Wissam Ali Al-Husseini",
    authorEmail: "wissam.husseini@uokerbala.edu.iq",
    institution: "Department of Pathology, College of Medicine, University of Kerbala",
    submissionDate: "January 14, 2026",
    status: "Accepted",
    fileName: "RCC_Histopathology_SouthernIraq.docx",
    abstract: "A retrospective clinicopathological review of 142 nephrectomy specimens analyzed clear cell, papillary, and chromophobe subtypes with immunohistochemical marker validation (CK7, CD10, and AMACR).",
    keywords: ["Renal Cell Carcinoma", "Histopathology", "Immunohistochemistry", "Clear Cell"],
    assignedReviewers: [
      {
        id: "REV-102",
        name: "Dr. Fatima H. Al-Rubaie",
        institution: "Al-Habbobi Teaching Hospital",
        email: "fatima.alrubaie@imjb-iq.org",
        specialty: "Pathology & Histopathology",
        status: "Completed",
        recommendation: "Accept"
      }
    ],
    decisionNotes: "Manuscript accepted for publication in Volume 4 Issue 2 (June 2026). DOI assigned.",
    logs: [
      { date: "January 14, 2026", action: "Manuscript Submitted", actor: "Author" },
      { date: "February 10, 2026", action: "Revisions Submitted & Approved", actor: "Author & Editor" },
      { date: "February 15, 2026", action: "Official Acceptance Letter Issued", actor: "Editor-in-Chief" }
    ]
  },
  {
    id: "IMJB-2025-SUB-881293",
    trackingCode: "TRK-33291",
    title: "Unusual Manifestation of Cutaneous Leishmaniasis Presenting as Chronic Sporotrichoid Lesions",
    articleType: "Case Report",
    scope: "Clinical Medicine",
    correspondingAuthor: "Dr. Noor Al-Huda Jassim",
    authorEmail: "noor.jassim@uokufa.edu.iq",
    institution: "Al-Sadr Teaching Hospital, Kufa",
    submissionDate: "December 12, 2025",
    status: "Rejected",
    fileName: "CaseReport_Leishmania_Sporotrichoid.pdf",
    abstract: "We report a 34-year-old male presenting with nodular lymphatic lesions along the left upper extremity following exposure in rural marshlands.",
    keywords: ["Leishmaniasis", "Cutaneous", "Sporotrichoid", "Case Report"],
    assignedReviewers: [
      {
        id: "REV-106",
        name: "Dr. Zainab Abdul-Amir",
        institution: "Al-Habbobi Teaching Hospital",
        email: "zainab.abdulamir@imjb-iq.org",
        specialty: "Parasitology & Mycology",
        status: "Completed",
        recommendation: "Reject"
      }
    ],
    rejectionReason: "Case report lacks novel diagnostic insight or molecular species identification (L. major vs L. tropica).",
    logs: [
      { date: "December 12, 2025", action: "Manuscript Submitted", actor: "Author" },
      { date: "January 05, 2026", action: "Desk Rejection Issued", actor: "Editor-in-Chief" }
    ]
  }
];
