import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import moodsRouter from "./moods";
import settingsRouter from "./settings";
import aiRouter from "./ai";
import { isConnected } from "../lib/db";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
const requireDatabase: import("express").RequestHandler = (_req, res, next) => {
  if (!isConnected()) {
    res.status(503).json({
      error: "Database unavailable. Please try again when the service is restored.",
    });
    return;
  }
  next();
};

router.use("/users", requireDatabase, usersRouter);
router.use("/moods", requireDatabase, moodsRouter);
router.use("/settings", requireDatabase, settingsRouter);

export default router;
