import Dexie, { Table } from 'dexie';
import { SubmissionRecord, AssignedReviewer, EditorialLog } from '../types';
import { INITIAL_ADMIN_SUBMISSIONS, ACRREDITED_REVIEWERS } from '../data/adminMockData';

export interface DBLogEntry {
  id?: number;
  submissionId: string;
  date: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface DBJournalSetting {
  key: string;
  value: any;
  updatedAt: string;
}

// Realm DB / IndexedDB Class Definition using Dexie
export class JournalLocalRealmDB extends Dexie {
  submissions!: Table<SubmissionRecord, string>;
  reviewers!: Table<AssignedReviewer, string>;
  logs!: Table<DBLogEntry, number>;
  journalSettings!: Table<DBJournalSetting, string>;

  constructor() {
    super('IMJB_Journal_RealmDB');

    // Define DB Schema and indexed fields
    this.version(1).stores({
      submissions: 'id, trackingCode, status, scope, submissionDate, correspondingAuthor, articleType',
      reviewers: 'id, name, specialty, status, email',
      logs: '++id, submissionId, date, actor',
      journalSettings: 'key'
    });
  }
}

export const realmDB = new JournalLocalRealmDB();

// Helper functions for Realm DB Operations
export const initRealmDatabase = async (): Promise<SubmissionRecord[]> => {
  try {
    const count = await realmDB.submissions.count();
    if (count === 0) {
      console.log('⚡ Initializing Local Realm DB with seed data...');
      await realmDB.submissions.bulkAdd(INITIAL_ADMIN_SUBMISSIONS);
      await realmDB.reviewers.bulkAdd(ACRREDITED_REVIEWERS);

      // Add initial settings
      await realmDB.journalSettings.put({
        key: 'journal_info',
        value: {
          title: 'Iraqi Journal of Biomedical and Clinical Medicine',
          publisher: 'Al-Habbobi Teaching Hospital',
          volume: 4,
          issue: 2,
          issn: '2709-1980'
        },
        updatedAt: new Date().toISOString()
      });
    }

    // Return all submissions ordered
    return await realmDB.submissions.toArray();
  } catch (err) {
    console.error('Error initializing Realm DB:', err);
    return INITIAL_ADMIN_SUBMISSIONS;
  }
};

export const fetchAllSubmissionsFromDB = async (): Promise<SubmissionRecord[]> => {
  try {
    const list = await realmDB.submissions.toArray();
    return list.reverse(); // Newest first
  } catch (err) {
    console.error('Failed fetching submissions from Realm DB:', err);
    return [];
  }
};

export const addSubmissionToDB = async (submission: SubmissionRecord): Promise<void> => {
  try {
    await realmDB.submissions.put(submission);
    
    // Log entry
    if (submission.logs) {
      for (const l of submission.logs) {
        await realmDB.logs.add({
          submissionId: submission.id,
          date: l.date,
          action: l.action,
          actor: l.actor,
          notes: l.notes
        });
      }
    }
  } catch (err) {
    console.error('Failed adding submission to Realm DB:', err);
  }
};

export const updateSubmissionInDB = async (id: string, updates: Partial<SubmissionRecord>): Promise<void> => {
  try {
    await realmDB.submissions.update(id, updates);
  } catch (err) {
    console.error('Failed updating submission in Realm DB:', err);
  }
};

export const deleteSubmissionFromDB = async (id: string): Promise<void> => {
  try {
    await realmDB.submissions.delete(id);
    await realmDB.logs.where('submissionId').equals(id).delete();
  } catch (err) {
    console.error('Failed deleting submission from Realm DB:', err);
  }
};

export const clearAndResetRealmDB = async (): Promise<SubmissionRecord[]> => {
  try {
    await realmDB.submissions.clear();
    await realmDB.reviewers.clear();
    await realmDB.logs.clear();
    await realmDB.journalSettings.clear();

    await realmDB.submissions.bulkAdd(INITIAL_ADMIN_SUBMISSIONS);
    await realmDB.reviewers.bulkAdd(ACRREDITED_REVIEWERS);

    return await realmDB.submissions.toArray();
  } catch (err) {
    console.error('Failed resetting Realm DB:', err);
    return INITIAL_ADMIN_SUBMISSIONS;
  }
};

export const exportRealmDBJSON = async (): Promise<string> => {
  const submissions = await realmDB.submissions.toArray();
  const reviewers = await realmDB.reviewers.toArray();
  const logs = await realmDB.logs.toArray();
  const settings = await realmDB.journalSettings.toArray();

  return JSON.stringify({
    dbName: 'IMJB_Journal_RealmDB',
    exportedAt: new Date().toISOString(),
    submissions,
    reviewers,
    logs,
    settings
  }, null, 2);
};
