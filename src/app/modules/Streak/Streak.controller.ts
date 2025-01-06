import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { StreakService } from "./Streak.service";

const calculateStreaks = catchAsync(async (req: Request   & { user?: IAuthUser }, res: Response) => {
    if (!req.user?.user) {
        throw new Error('User not found');
    }
    const user = req.user;
    const result = await StreakService.calculateStreaks(user.user)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Streak data deleted!",
        data: result,
    });
});

export const StreakController = {
    calculateStreaks
};
