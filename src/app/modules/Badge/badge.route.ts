import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { BadgeController } from "./badge.controller";

const router = Router();

router.get("/", BadgeController.getAll);
router.get("/:id", BadgeController.getOne);
router.post("/", auth(Role.ADMIN),BadgeController.create);
router.patch("/:id", auth(Role.ADMIN),BadgeController.update);
router.delete("/:id", auth(Role.ADMIN),BadgeController.remove);

export const BadgeRoutes = router;
