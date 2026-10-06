import { Router, type IRouter } from "express";
import { HealthCheckResponse, LivenessCheckResponse } from "@workspace/api-zod";
import { isConnected } from "../lib/db";

const router: IRouter = Router();

router.get("/livez", (_req, res) => {
  const data = LivenessCheckResponse.parse({ status: "ok" });
  res.status(200).json(data);
});

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({
    status: isConnected() ? "ok" : "database unavailable",
  });
  res.status(isConnected() ? 200 : 503).json(data);
});

export default router;
