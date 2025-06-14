import { startCodeforcesSync  } from '@/cron/syncCodeforces';

export const initApp = () => {
  startCodeforcesSync();
 
};
