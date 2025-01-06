import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";


import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { FocusMetricService } from "./focusMetric.service";


const getFocusMetrics = catchAsync(async (req: Request  & { user?: IAuthUser }, res: Response) => {
    if (!req.user?.user) {
        throw new Error('User not found');
    }
    const user = req.user;
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
        throw new Error('Date parameter is required and must be a string');
    }

    const result = await FocusMetricService.getFocusMetrics(user.user, date);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "FocusMetric data deleted!",
        data: result,
    });
});


export const FocusMetricController = {
    getFocusMetrics
};
