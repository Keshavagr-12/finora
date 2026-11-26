import axios from "axios";


const axiosConfig = {

    baseURL: import.meta.env.VITE_API_BASE_URL,

    timeout: 10000,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }

};


const api = axios.create(axiosConfig);


// Separate client for token refresh
const refreshClient = axios.create(axiosConfig);


// Shared refresh promise
let refreshPromise = null;


const publicEndpoints = [
    "/auth/register",
    "/auth/login",
    "/auth/refresh",
    "/auth/logout"
];


export const setupInterceptors = (authStore) => {


    // Request Interceptor

    const requestInterceptor = api.interceptors.request.use(

        (config) => {

            const accessToken =
                authStore.getState().accessToken;

            const isPublicEndpoint =
                publicEndpoints.includes(config.url);

            if (accessToken && !isPublicEndpoint) {

                config.headers.Authorization =
                    `Bearer ${accessToken}`;

            }

            return config;

        },

        (error) => Promise.reject(error)

    );


    // Response Interceptor

    const responseInterceptor = api.interceptors.response.use(

        (response) => response,

        async (error) => {

            const originalRequest = error.config;


            if (
                !originalRequest ||
                error.response?.status !== 401 ||
                originalRequest._retry ||
                publicEndpoints.includes(originalRequest.url)
            ) {

                return Promise.reject(error);

            }


            const currentToken =
                authStore.getState().accessToken;


            // Do not refresh unauthenticated requests

            if (!currentToken) {

                return Promise.reject(error);

            }


            originalRequest._retry = true;


            // Another request may have already refreshed the token

            const previousAuthorization =
                originalRequest.headers?.Authorization;

            if (
                previousAuthorization &&
                previousAuthorization !== `Bearer ${currentToken}`
            ) {

                originalRequest.headers.Authorization =
                    `Bearer ${currentToken}`;

                return api(originalRequest);

            }


            try {

                if (!refreshPromise) {

                    refreshPromise = refreshClient
                        .post("/auth/refresh")

                        .then((response) => {

                            const newAccessToken =
                                response.data.data.accessToken;

                            if (!newAccessToken) {

                                throw new Error(
                                    "Refresh response did not contain an access token"
                                );

                            }

                            authStore
                                .getState()
                                .setAccessToken(newAccessToken);

                            return newAccessToken;

                        })

                        .catch((refreshError) => {

                            if (refreshError.response?.status === 401) {

                                authStore.getState().clearAuth();

                            }

                            throw refreshError;

                        })

                        .finally(() => {

                            refreshPromise = null;

                        });

                }


                const newAccessToken = await refreshPromise;


                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                return api(originalRequest);


            } catch (refreshError) {

                return Promise.reject(refreshError);

            }

        }

    );


    // Cleanup interceptors

    return () => {

        api.interceptors.request.eject(requestInterceptor);

        api.interceptors.response.eject(responseInterceptor);

    };

};


export default api;