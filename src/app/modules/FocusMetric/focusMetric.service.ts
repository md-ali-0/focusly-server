import { paginationHelper } from "@/helpars/paginationHelper";
import prisma from "@/shared/prisma";
import redisClient from "@/shared/redis";
import { FocusMetric, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";

const REDIS_PREFIX = "focusMetric";

// Create a new focus metric
const create = async (payload: any) => {
    const result = await prisma.focusMetric.create({
        data: payload,
    });

    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

// Get all focus metrics with Redis caching
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

    const andConditions: Prisma.FocusMetricWhereInput[] = [];
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

    const whereConditions: Prisma.FocusMetricWhereInput = { AND: andConditions };

    const result = await prisma.focusMetric.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                      [options?.sortBy]: options.sortOrder,
                  }
                : {
                      createdAt: "desc",
                  },
    });

    const total = await prisma.focusMetric.count({
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

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 3600 }); // Cache for 1 hour

    return response;
};

// Get a single focus metric by ID with Redis caching
const getOne = async (id: string): Promise<FocusMetric | null> => {
    const cacheKey = `${REDIS_PREFIX}:one:${id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const result = await prisma.focusMetric.findUnique({
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
    data: Partial<FocusMetric>
): Promise<FocusMetric> => {
    await prisma.focusMetric.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.focusMetric.update({
        where: {
            id,
        },
        data,
    });

    await redisClient.del(`${REDIS_PREFIX}:one:${id}`);
    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

// Delete a focus metric by ID
const remove = async (id: string): Promise<FocusMetric | null> => {
    await prisma.focusMetric.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.focusMetric.delete({
        where: {
            id,
        },
    });

    await redisClient.del(`${REDIS_PREFIX}:one:${id}`);
    await redisClient.del(`${REDIS_PREFIX}:all`);
    return result;
};

export const FocusMetricService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
