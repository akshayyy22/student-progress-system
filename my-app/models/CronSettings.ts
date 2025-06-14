// models/CronSettings.ts
import mongoose from 'mongoose';

const CronSettingsSchema = new mongoose.Schema({
  cronTime: {
    type: String,
    required: true,
    default: '0 2 * * *', // 2 AM
  },
}, { timestamps: true });

export default mongoose.models.CronSettings || mongoose.model('CronSettings', CronSettingsSchema);
