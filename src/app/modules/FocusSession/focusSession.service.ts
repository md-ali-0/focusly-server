import { paginationHelper } from "@/helpars/paginationHelper";
import prisma from "@/shared/prisma";
import redisClient from "@/shared/redis";
import { FocusSession, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";

const REDIS_PREFIX = "focusSession";

const create = async (payload: any) => {
    const result = await prisma.focusSession.create({
        data: payload,
    });

    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

const getAll = async (
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const cacheKey = `${REDIS_PREFIX}:all:${JSON.stringify(params)}:${page}:${limit}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.FocusSessionWhereInput[] = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: ["name", "slug"].map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.FocusSessionWhereInput = { AND: andConditions };

    const result = await prisma.focusSession.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                      [options.sortBy]: options.sortOrder,
                  }
                : {
                      createdAt: "desc",
                  },
    });

    const total = await prisma.focusSession.count({
        where: whereConditions,
    });

    const totalPage = Math.ceil(total / limit);

    const response = {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: result,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 });

    return response;
};

const getOne = async (id: string): Promise<FocusSession | null> => {
    const cacheKey = `${REDIS_PREFIX}:one:${id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const result = await prisma.focusSession.findUnique({
        where: {
            id,
        },
    });

    if (result) {
        await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 });
    }

    return result;
};

const update = async (
    id: string,
    data: Partial<FocusSession>
): Promise<FocusSession> => {
    await prisma.focusSession.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.focusSession.update({
        where: {
            id,
        },
        data,
    });

    await redisClient.del(`${REDIS_PREFIX}:one:${id}`);
    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

const remove = async (id: string): Promise<FocusSession | null> => {
    await prisma.focusSession.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.focusSession.delete({
        where: {
            id,
        },
    });

    await redisClient.del(`${REDIS_PREFIX}:one:${id}`);
    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

export const FocusSessionService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
