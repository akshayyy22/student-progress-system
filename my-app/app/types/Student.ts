// types/Student.ts (or types.ts)
export interface Student {
    _id: string;
    name: string;
    email: string;
    phone: string;
    codeforcesHandle: string;
    currentRating?: number;
    maxRating?: number;
    lastSynced?: string;
    remindersSent?: number;
    autoReminder?: boolean;
  }
  