import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { BadgeRoutes } from "../modules/Badge/badge.route";
import { FocusMetricRoutes } from "../modules/FocusMetric/focusMetric.route";
import { FocusSessionRoutes } from "../modules/FocusSession/focusSession.route";
import { StreakRoutes } from "../modules/Streak/Streak.route";
import { userRoutes } from "../modules/User/user.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/focus-session",
        route: FocusSessionRoutes,
    },
    {
        path: "/focus-metric",
        route: FocusMetricRoutes,
    },
    {
        path: "/badge",
        route: BadgeRoutes,
    },
    {
        path: "/streak",
        route: StreakRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
