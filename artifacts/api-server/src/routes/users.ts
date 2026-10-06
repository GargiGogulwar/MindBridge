import { Router } from "express";
import { User } from "../models/User";
import { Settings } from "../models/Settings";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { userId, name, avatar, role, email } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({
        userId,
        email: email ? email.toLowerCase().trim() : "",
        name: name || "User",
        avatar: avatar || "",
        role: role || "user",
        streak: 0,
        lastCheckin: null,
      });
      await Settings.create({ userId, userName: name || "User" });
    } else if (email && !user.email) {
      user.email = email.toLowerCase().trim();
      await user.save();
    }
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No account found with that email" });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { name, avatar, streak, lastCheckin, email } = req.body;
    const update: any = { name, avatar, streak, lastCheckin };
    if (email) update.email = email.toLowerCase().trim();
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: update },
      { new: true, upsert: true }
    );
    return res.json(user);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    await User.deleteOne({ userId: req.params.userId });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
