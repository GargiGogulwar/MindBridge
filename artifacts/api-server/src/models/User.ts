import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  streak: number;
  lastCheckin: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: "", index: true },
    name: { type: String, required: true, default: "User" },
    avatar: { type: String, default: "" },
    role: { type: String, default: "user" },
    streak: { type: Number, default: 0 },
    lastCheckin: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
