import { Router } from "express";
import { Mood } from "../models/Mood";
import { User } from "../models/User";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    return res.json(moods);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const entry = {
      userId,
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    const mood = await Mood.create(entry);

    const today = new Date().toDateString();
    const user = await User.findOne({ userId });
    if (user) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = user.lastCheckin === yesterday.toDateString();
      const newStreak =
        user.lastCheckin !== today
          ? wasYesterday
            ? (user.streak || 0) + 1
            : 1
          : user.streak;
      await User.updateOne({ userId }, { $set: { streak: newStreak, lastCheckin: today } });
    }

    return res.status(201).json(mood);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:userId/:id", async (req, res) => {
  try {
    await Mood.deleteOne({ _id: req.params.id, userId: req.params.userId });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:userId/stats/summary", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    if (!moods.length) return res.json(null);

    const emotionCounts: Record<string, number> = {};
    let totalIntensity = 0;

    moods.forEach((m) => {
      emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
      totalIntensity += m.intensity || 5;
    });

    const avgIntensity = Math.round(totalIntensity / moods.length);
    const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const dayMoods = moods.filter((m) => new Date(m.timestamp).toDateString() === dayStr);
      const avgDay = dayMoods.length
        ? Math.round(dayMoods.reduce((acc, m) => acc + (m.intensity || 5), 0) / dayMoods.length)
        : null;
      dailyData.push({ day: d.toLocaleDateString("en", { weekday: "short" }), intensity: avgDay, count: dayMoods.length });
    }

    return res.json({
      avgIntensity,
      dominantEmotion,
      emotionCounts,
      dailyData,
      total: moods.length,
      last7: moods.slice(0, 7),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
