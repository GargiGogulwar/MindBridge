import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  userId: string;
  notifications: boolean;
  caregiverEmail: string;
  userName: string;
  theme: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    notifications: { type: Boolean, default: true },
    caregiverEmail: { type: String, default: "" },
    userName: { type: String, default: "User" },
    theme: { type: String, default: "dark" },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);
