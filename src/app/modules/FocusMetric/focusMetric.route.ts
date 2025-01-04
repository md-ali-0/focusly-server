import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { FocusMetricController } from "./focusMetric.controller";

const router = Router();

router.get("/", FocusMetricController.getAll);
router.get("/:id", FocusMetricController.getOne);
router.post("/", auth(Role.ADMIN),FocusMetricController.create);
router.patch("/:id", auth(Role.ADMIN),FocusMetricController.update);
router.delete("/:id", auth(Role.ADMIN),FocusMetricController.remove);

export const FocusMetricRoutes = router;
