import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { FocusMetricController } from "./focusMetric.controller";

const router = Router();

router.get("/", auth(Role.USER), FocusMetricController.getFocusMetrics);

export const FocusMetricRoutes = router;
