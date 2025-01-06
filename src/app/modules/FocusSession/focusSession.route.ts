import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { FocusSessionController } from "./focusSession.controller";

const router = Router();

router.get("/", auth(Role.USER),FocusSessionController.getTotalSessionAndTotalTime);
router.post("/", auth(Role.USER),FocusSessionController.createFocusSession);
router.patch("/:id", auth(Role.ADMIN),FocusSessionController.update);
router.delete("/:id", auth(Role.ADMIN),FocusSessionController.remove);

export const FocusSessionRoutes = router;
