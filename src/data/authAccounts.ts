import { UserAccount } from '../types';

export const ADMIN_ACCOUNT: UserAccount = {
  id: 'USR-ADMIN-01',
  username: 'admin',
  email: 'editor@imjb-iq.org',
  password: 'admin123',
  name: 'Prof. Dr. Editor-in-Chief',
  role: 'editor',
  institution: 'Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)'
};

export const REVIEWER_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-REV-101',
    username: 'tariq.aljanabi',
    email: 'tariq.aljanabi@med.uobaghdad.edu.iq',
    password: 'rev101password',
    name: 'Prof. Dr. Tariq Al-Janabi',
    role: 'reviewer',
    reviewerId: 'REV-101',
    specialty: 'Medical Microbiology & Virology',
    institution: 'College of Medicine, University of Baghdad'
  },
  {
    id: 'USR-REV-102',
    username: 'fatima.alrubaie',
    email: 'fatima.alrubaie@imjb-iq.org',
    password: 'rev102password',
    name: 'Dr. Fatima H. Al-Rubaie',
    role: 'reviewer',
    reviewerId: 'REV-102',
    specialty: 'Pathology & Histopathology',
    institution: 'Al-Habbobi Teaching Hospital'
  },
  {
    id: 'USR-REV-103',
    username: 'ahmed.sarray',
    email: 'ahmed.sarray@utq.edu.iq',
    password: 'rev103password',
    name: 'Dr. Ahmed Jabbar Al-Sarray',
    role: 'reviewer',
    reviewerId: 'REV-103',
    specialty: 'Clinical Chemistry & Molecular Biomarkers',
    institution: 'Thi-Qar University, College of Pharmacy'
  },
  {
    id: 'USR-REV-104',
    username: 'suhad.khafaji',
    email: 'suhad.khafaji@thi-qar-health.iq',
    password: 'rev104password',
    name: 'Dr. Suhad M. Al-Khafaji',
    role: 'reviewer',
    reviewerId: 'REV-104',
    specialty: 'Hematology & Blood Transfusion Medicine',
    institution: 'Al-Nasiriya General Hospital'
  },
  {
    id: 'USR-REV-105',
    username: 'hassan.mahdawi',
    email: 'hassan.mahdawi@uomustansiriyah.edu.iq',
    password: 'rev105password',
    name: 'Prof. Dr. Hassan K. Al-Mahdawi',
    role: 'reviewer',
    reviewerId: 'REV-105',
    specialty: 'Immunology & Serology',
    institution: 'Mustansiriyah University, College of Science'
  },
  {
    id: 'USR-REV-106',
    username: 'zainab.abdulamir',
    email: 'zainab.abdulamir@imjb-iq.org',
    password: 'rev106password',
    name: 'Dr. Zainab Abdul-Amir',
    role: 'reviewer',
    reviewerId: 'REV-106',
    specialty: 'Parasitology & Mycology',
    institution: 'Al-Habbobi Teaching Hospital'
  }
];

export const AUTHOR_ACCOUNT: UserAccount = {
  id: 'USR-AUTH-01',
  username: 'author',
  email: 'author@hospital.iq',
  password: 'author123',
  name: 'Dr. Haider Majeed Al-Zaidi',
  role: 'author',
  institution: 'Thi-Qar University Hospital'
};

export const ALL_SYSTEM_USERS: UserAccount[] = [
  ADMIN_ACCOUNT,
  ...REVIEWER_ACCOUNTS,
  AUTHOR_ACCOUNT
];
