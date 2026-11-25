import { getAIHealth } from "../../integrations/aiService.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const checkAIHealth = async (req, res, next) => {
    try {
        const data = await getAIHealth();

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "AI service is healthy"
            )
        );

    } catch (error) {
        next(error);
    }
};