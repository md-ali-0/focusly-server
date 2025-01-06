import prisma from "../../../shared/prisma";
import redisClient from "../../../shared/redis";

const REDIS_PREFIX = "focusMetric";

const motivationalMessages = [
    "Great things never come from comfort zones!",
    "Stay focused and never give up!",
    "Your hard work is paying off, keep it up!",
    "Every step forward is a step closer to your goals.",
    "Believe in yourself and all that you are.",
    "The future depends on what you do today.",
    "Discipline is the bridge between goals and achievement.",
    "Success is the sum of small efforts repeated daily.",
    "Focus on progress, not perfection.",
    "You're doing amazing, one step at a time!"
];

const getFocusMetrics = async (userId: string, date: string) => {
    const cacheKey = `${REDIS_PREFIX}:metrics:${userId}:${date}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - diffToMonday));
    const startOfPeriod = new Date(startOfWeek.setHours(0, 0, 0, 0));

    const endOfWeek = new Date(startOfPeriod);
    const endOfPeriod = new Date(endOfWeek.setDate(endOfWeek.getDate() + 6));
    endOfPeriod.setHours(23, 59, 59, 999);

    const dailyMetrics = await Promise.all(
        Array.from({ length: 7 }, (_, i) => {
            const dayStart = new Date(startOfPeriod);
            dayStart.setDate(startOfPeriod.getDate() + i);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            return prisma.focusSession.aggregate({
                _sum: { duration: true },
                _count: { id: true },
                where: {
                    userId,
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd,
                    },
                },
            }).then((metrics) => ({
                date: dayStart.toISOString().split("T")[0],
                totalFocusTime: metrics._sum.duration || 0,
                totalSessions: metrics._count.id || 0,
            }));
        })
    );

    const weeklyMetrics = await prisma.focusSession.aggregate({
        _sum: { duration: true },
        _count: { id: true },
        where: {
            userId,
            createdAt: {
                gte: startOfPeriod,
                lte: endOfPeriod,
            },
        },
    });

    const motivationalMessage =
        motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    const response = {
        daily: dailyMetrics,
        weekly: {
            totalFocusTime: weeklyMetrics._sum.duration || 0,
            totalSessions: weeklyMetrics._count.id || 0,
        },
        periodStartDate: startOfPeriod.toISOString(),
        periodEndDate: endOfPeriod.toISOString(),
        motivationalMessage,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });

    return response;
};

export const FocusMetricService = {
    getFocusMetrics,
};
