import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { FocusSessionService } from "./focusSession.service";

const createFocusSession = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    if (!req.user?.user) {
        throw new Error('User not found');
    }
    const user = req.user;

    const result = await FocusSessionService.createFocusSession(user.user, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "FocusSession data Completed!",
        data: result,
    });
});

const getAll: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, ["name", "searchTerm"]);
        const options = pick(req.query, [
            "limit",
            "page",
            "sortBy",
            "sortOrder",
        ]);
        const result = await FocusSessionService.getAll(filters, options);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "FocusSession data fetched!",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getTotalSessionAndTotalTime = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    if (!req.user?.user) {
        throw new Error('User not found');
    }
    const user = req.user;

    const result = await FocusSessionService.getTotalSessionAndTotalTime(user.user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "FocusSession data fetched by id!",
        data: result,
    });
});

const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await FocusSessionService.update(id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "FocusSession data updated!",
        data: result,
    });
});

const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await FocusSessionService.remove(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "FocusSession data deleted!",
        data: result,
    });
});

export const FocusSessionController = {
    createFocusSession,
    getAll,
    getTotalSessionAndTotalTime,
    update,
    remove,
};
