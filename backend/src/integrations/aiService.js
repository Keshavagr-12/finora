
import axios from "axios";

import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const aiClient = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: env.AI_SERVICE_TIMEOUT,
    headers: {
        "Content-Type": "application/json"
    }
});

aiClient.interceptors.response.use(
    (response) => response,

    (error) => {
        if (
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT"
        ) {
            return Promise.reject(
                new ApiError(504, "AI service request timed out")
            );
        }

        if (!error.response) {
            return Promise.reject(
                new ApiError(503, "AI service is unavailable")
            );
        }

        return Promise.reject(
            new ApiError(502, "AI service request failed")
        );
    }
);

export const getAIHealth = async () => {
    const response = await aiClient.get("/ai/v1/health");

    return response.data;
};

export default aiClient;