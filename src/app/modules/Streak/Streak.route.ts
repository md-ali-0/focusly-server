import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { StreakController } from "./Streak.controller";

const router = Router();

router.get("/", auth(Role.USER), StreakController.calculateStreaks);

export const StreakRoutes = router;
