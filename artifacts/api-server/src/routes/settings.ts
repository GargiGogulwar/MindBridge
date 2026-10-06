import { Router } from "express";
import { Settings } from "../models/Settings";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.params.userId });
    if (!settings) {
      settings = await Settings.create({
        userId: req.params.userId,
        notifications: true,
        caregiverEmail: "",
        userName: "User",
        theme: "dark",
      });
    }
    return res.json(settings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    return res.json(settings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
