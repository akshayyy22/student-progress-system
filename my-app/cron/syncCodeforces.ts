// import cron from 'node-cron';
// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';
// import { connectDB } from '@/lib/db';
// import Student from '@/models/Student';
// import { sendReminderEmail } from '@/utils/sendMail';

// // Utility: Read cron-config.json to get user-defined time
// async function getCronTime(): Promise<string> {
//   try {
//     const configPath = path.join(process.cwd(), 'cron-config.json');
//     const data = await fs.readFile(configPath, 'utf-8');
//     const config = JSON.parse(data);

//     if (typeof config.time === 'string' && cron.validate(config.time)) {
//       return config.time;
//     }

//     console.warn('[CRON] Invalid cron time in config. Falling back to default.');
//     return '0 2 * * *'; // Default: 2 AM
//   } catch (err) {
//     console.error('[CRON] Failed to read cron-config.json:', err);
//     return '0 2 * * *';
//   }
// }

// export const startCodeforcesSync = async () => {
//   const cronTime = await getCronTime();
//   console.log('[CRON] Using cron time:', cronTime);

//   if (!cron.validate(cronTime)) {
//     console.error('[CRON] ❌ Invalid cron expression:', cronTime);
//     return;
//   }

//   cron.schedule(cronTime, async () => {
//     console.log(`[CRON] 🔁 Codeforces sync started at ${new Date().toLocaleString()}`);

//     await connectDB();
//     const students = await Student.find();

//     for (const student of students) {
//       try {
//         const handle = student.codeforcesHandle;
//         if (!handle) continue;

//         // 1. Get rating
//         const userRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
//         const user = userRes.data.result[0];

//         const currentRating = user.rating || 0;
//         const maxRating = user.maxRating || 0;

//         // 2. Check submissions for recent activity
//         const submissionRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
//         const hasRecentSubmission = submissionRes.data.result.some(sub => {
//           const daysAgo = (Date.now() - sub.creationTimeSeconds * 1000) / (1000 * 60 * 60 * 24);
//           return daysAgo <= 7;
//         });

//         // 3. Update DB with new ratings and sync time
//         await Student.findByIdAndUpdate(student._id, {
//           $set: {
//             currentRating,
//             maxRating,
//             lastSynced: new Date(),
//           },
//         });

//         console.log(`[SYNC] ✅ ${handle} updated | Rating: ${currentRating} | Active: ${hasRecentSubmission}`);

//         // 4. Send reminder if inactive
//         if (!hasRecentSubmission && student.autoReminder !== false && student.email) {
//           await sendReminderEmail(student.email, student.name);
//           await Student.findByIdAndUpdate(student._id, {
//             $inc: { remindersSent: 1 },
//           });
//           console.log(`[EMAIL] 📩 Reminder sent to ${student.email}`);
//         }
//       } catch (error: any) {
//         console.error(`[ERROR] ❌ Failed to sync ${student.codeforcesHandle}:`, error.message);
//       }
//     }

//     console.log('[CRON] ✅ Codeforces sync job finished.');
//   }, {
//     timezone: 'Asia/Kolkata',
//   });
// };



import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import Student from '@/models/Student';
import { sendReminderEmail } from '@/utils/sendMail';

// 1. Read cron time from config
async function getCronTime(): Promise<string> {
  try {
    const configPath = path.join(process.cwd(), 'cron-config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(data);
    if (typeof config.time === 'string' && cron.validate(config.time)) {
      return config.time;
    }
    console.warn('[CRON] Invalid cron time in config. Falling back to default.');
    return '0 2 * * *';
  } catch (err) {
    console.error('[CRON] Failed to read cron-config.json:', err);
    return '0 2 * * *';
  }
}

// 2. Main sync job
export const startCodeforcesSync = async () => {
  const cronTime = await getCronTime();
  console.log('[CRON] Using cron time:', cronTime);

  if (!cron.validate(cronTime)) {
    console.error('[CRON] ❌ Invalid cron expression:', cronTime);
    return;
  }

  cron.schedule(cronTime, async () => {
    console.log(`[CRON] 🔁 Codeforces sync started at ${new Date().toLocaleString()}`);
    await connectDB();
    const students = await Student.find();

    for (const student of students) {
      try {
        const handle = student.codeforcesHandle;
        if (!handle) continue;

        // 1. Fetch rating
        const userRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const user = userRes.data.result[0];

        const currentRating = user.rating || 0;
        const maxRating = user.maxRating || 0;

        // 2. Fetch submissions
        const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const recent = subRes.data.result.some((sub : any) => {
          const daysAgo = (Date.now() - sub.creationTimeSeconds * 1000) / (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        });

        // 3. Update ratings and sync time
        await Student.findByIdAndUpdate(student._id, {
          $set: {
            currentRating,
            maxRating,
            lastSynced: new Date(),
          },
        });

        console.log(`[SYNC] ✅ ${handle} updated | Rating: ${currentRating} | Active: ${recent}`);

        // 4. Send reminder if inactive and autoReminder is enabled
        if (!recent && student.autoReminder !== false && student.email) {
          await sendReminderEmail(student.email, student.name);
          await Student.findByIdAndUpdate(student._id, {
            $inc: { remindersSent: 1 },
          });
          console.log(`[EMAIL] 📩 Reminder sent to ${student.email}`);
        }
      } catch (error: any) {
        console.error(`[ERROR] ❌ Failed to sync ${student.codeforcesHandle}:`, error.message);
      }
    }

    console.log('[CRON] ✅ Codeforces sync job finished.');
  }, {
    timezone: 'Asia/Kolkata',
  });
};
