import mongoose, { Schema, Document } from "mongoose";

export interface IMood extends Document {
  userId: string;
  text: string;
  emojis: string[];
  emotion: string;
  intensity: number;
  sentiment: string;
  crisisRisk: string;
  suggestions: string[];
  summary: string;
  timestamp: string;
  createdAt: Date;
}

const MoodSchema = new Schema<IMood>(
  {
    userId: { type: String, required: true, index: true },
    text: { type: String, default: "" },
    emojis: { type: [String], default: [] },
    emotion: { type: String, default: "neutral" },
    intensity: { type: Number, default: 5 },
    sentiment: { type: String, default: "neutral" },
    crisisRisk: { type: String, default: "none" },
    suggestions: { type: [String], default: [] },
    summary: { type: String, default: "" },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

MoodSchema.index({ userId: 1, timestamp: -1 });

export const Mood = mongoose.model<IMood>("Mood", MoodSchema);
