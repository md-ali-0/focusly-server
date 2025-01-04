import { paginationHelper } from "@/helpars/paginationHelper";
import prisma from "@/shared/prisma";
import { Badge, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";

// Create a new focus metric
const create = async (payload: any) => {
    const result = await prisma.badge.create({
        data: payload,
    });

    return result;
};

// Get all focus metrics with Redis caching
const getAll = async (
    params: Record<string, unknown>,
    options: IPaginationOptions
) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.BadgeWhereInput[] = [];
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

    const whereConditions: Prisma.BadgeWhereInput = {
        AND: andConditions,
    };

    const result = await prisma.badge.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                      [options?.sortBy]: options.sortOrder,
                  }
                : {
                    awardedAt: "desc",
                  },
    });

    const total = await prisma.badge.count({
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

// Get a single focus metric by ID with Redis caching
const getOne = async (id: string): Promise<Badge | null> => {
    const result = await prisma.badge.findUnique({
        where: {
            id,
        },
    });

    return result;
};

const update = async (
    id: string,
    data: Partial<Badge>
): Promise<Badge> => {
    await prisma.badge.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.badge.update({
        where: {
            id,
        },
        data,
    });

    return result;
};

// Delete a focus metric by ID
const remove = async (id: string): Promise<Badge | null> => {
    await prisma.focusMetric.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.badge.delete({
        where: {
            id,
        },
    });

    return result;
};

export const BadgeService = {
    create,
    getAll,
    getOne,
    update,
    remove,
};
