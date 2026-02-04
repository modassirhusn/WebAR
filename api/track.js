import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';

// Define Schema
const EngagementSchema = new mongoose.Schema({
  event: Object,
  timestamp: { type: Date, default: Date.now }
});

const Engagement = mongoose.models.Engagement || mongoose.model('Engagement', EngagementSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    const engagement = await Engagement.create({ event: req.body });
    console.log("📊 Engagement Saved:", engagement);
    res.status(200).json({ success: true, id: engagement._id });
  } catch (err) {
    console.error("❌ Tracking Error:", err);
    res.status(500).json({ error: "Tracking failed" });
  }
}
