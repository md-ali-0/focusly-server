import prisma from "../../../shared/prisma";

const calculateStreaks = async (userId: string) => {
    const focusSessions = await prisma.focusSession.findMany({
        where: { userId, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
    });

    if (!focusSessions.length) {
        throw new Error("No focus sessions found for the user.");
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let badges: string[] = [];
    let prevSessionDate: Date | null = null;

    focusSessions.forEach((session) => {
        const sessionDate = new Date(session.createdAt);

        if (prevSessionDate === null) {
            prevSessionDate = sessionDate;
            currentStreak = 1;
        } else {

            const diffInDays = (sessionDate.getTime() - prevSessionDate.getTime()) / (1000 * 3600 * 24);

            if (diffInDays === 1) {

                currentStreak += 1;
            } else if (diffInDays > 1) {

                currentStreak = 1;
            }
            prevSessionDate = sessionDate;
        }


        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }


        if (currentStreak >= 30) badges.push("Gold Badge");
        else if (currentStreak >= 10) badges.push("Silver Badge");
        else if (currentStreak >= 5) badges.push("Bronze Badge");
    });

    const lastSessionDate = focusSessions[0].createdAt;
    const diffInDays = (new Date().getTime() - new Date(lastSessionDate).getTime()) / (1000 * 3600 * 24);
    if (diffInDays > 3) {
        currentStreak = 0;
    }

    return { currentStreak, longestStreak, badges };
};

export const StreakService = {
    calculateStreaks
};
