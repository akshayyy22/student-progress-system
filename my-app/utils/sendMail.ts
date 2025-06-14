import nodemailer from 'nodemailer';

export const sendReminderEmail = async (to: string, studentName: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Student Tracker" <${process.env.EMAIL}>`,
    to,
    subject: 'Inactivity Reminder',
    text: `Hi ${studentName}, we noticed you haven’t submitted any Codeforces problems in the past week. Keep up the grind! 💪`,
  });
};
