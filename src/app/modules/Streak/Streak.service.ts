import { paginationHelper } from "@/helpars/paginationHelper";
import prisma from "@/shared/prisma";
import { FocusMetric, Prisma, Streak } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";

// Create a new Streak
const create = async (payload: any) => {
    const result = await prisma.streak.create({
        data: payload,
    });

    return result;
};

// Get all Streaks
const getAll = async (
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.StreakWhereInput[] = [];
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

    const whereConditions: Prisma.StreakWhereInput = { AND: andConditions };

    const result = await prisma.streak.findMany({
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

    const total = await prisma.streak.count({
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

    return response;
};

// Get a single Streak by ID with Redis caching
const getOne = async (id: string): Promise<Streak | null> => {

    const result = await prisma.streak.findUnique({
        where: {
            id,
        },
    });

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

    return result;
};

// Delete a Streak by ID
const remove = async (id: string): Promise<Streak | null> => {
    await prisma.streak.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.streak.delete({
        where: {
            id,
        },
    });

    return result;
};

export const StreakService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
