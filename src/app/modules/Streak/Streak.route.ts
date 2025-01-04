import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { StreakController } from "./Streak.controller";

const router = Router();

router.get("/", StreakController.getAll);
router.get("/:id", StreakController.getOne);
router.post("/", auth(Role.ADMIN),StreakController.create);
router.patch("/:id", auth(Role.ADMIN),StreakController.update);
router.delete("/:id", auth(Role.ADMIN),StreakController.remove);

export const StreakRoutes = router;
