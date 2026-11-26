import { create } from "zustand";

import {
    registerAPI,
    loginAPI,
    logoutAPI,
    logoutAllAPI,
    refreshAPI,
    getMeAPI
} from "../api/auth.api";

import {
    getErrorMessage
} from "../utils/getErrorMessage";

let initializationPromise = null;


const useAuthStore = create((set, get) => ({

    // Authentication state

    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: false,

    isInitialized: false,

    error: null,

    initializationError: null,


    // State management actions

    setAuth: (user, accessToken) => {

        set({
            user,
            accessToken,
            isAuthenticated: true,
            error: null
        });

    },


    setAccessToken: (accessToken) => {

        set({ accessToken });

    },


    setUser: (user) => {

        set({ user });

    },


    setInitialized: (status) => {

        set({
            isInitialized: status
        });

    },


    clearError: () => {

        set({
            error: null
        });

    },


    clearAuth: () => {

        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });

    },

    initializeAuth: async () => {

    if (get().isInitialized) return;

    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {

        set({
            initializationError: null
        });

        try {

            const refreshResponse = await refreshAPI();

            const accessToken =
                refreshResponse.data.accessToken;

            if (!accessToken) {
                throw new Error("Access token not received");
            }

            get().setAccessToken(accessToken);


            const profileResponse = await getMeAPI();

            const user = profileResponse.data;

            if (!user?._id) {
                throw new Error("User profile not received");
            }

            get().setAuth(
                user,
                get().accessToken
            );

            set({
                isInitialized: true
            });

        } catch (error) {

            get().clearAuth();

            const status = error.response?.status;

            if (status === 401 || status === 403) {

                set({
                    isInitialized: true,
                    initializationError: null
                });

            } else {

                set({
                    isInitialized: false,
                    initializationError: getErrorMessage(error)
                });

            }

        }

    })().finally(() => {

        initializationPromise = null;

    });

    return initializationPromise;

},


    // Registration

    register: async (userData) => {

        set({
            isLoading: true,
            error: null
        });

        try {

            const response = await registerAPI(userData);

            return response;

        } catch (error) {

            set({
                error: getErrorMessage(error)
            });

            throw error;

        } finally {

            set({
                isLoading: false
            });

        }

    },


    // Login

    login: async (credentials) => {

        set({
            isLoading: true,
            error: null
        });

        try {

            const response = await loginAPI(credentials);

            const { user, accessToken } = response.data;

            get().setAuth(user, accessToken);

            return response;

        } catch (error) {

            set({
                error: getErrorMessage(error)
            });

            throw error;

        } finally {

            set({
                isLoading: false
            });

        }

    },


    // Logout current device

    logout: async () => {

        set({
            isLoading: true,
            error: null
        });

        try {

            const response = await logoutAPI();

            get().clearAuth();

            return response;

        } catch (error) {

            set({
                error: getErrorMessage(error)
            });

            throw error;

        } finally {

            set({
                isLoading: false
            });

        }

    },


    // Logout all devices

logoutAll: async () => {

    set({
        isLoading: true,
        error: null
    });

    try {

        const response = await logoutAllAPI();

        get().clearAuth();

        return response;

    } catch (error) {

        set({
            error: getErrorMessage(error)
        });

        throw error;

    } finally {

        set({
            isLoading: false
        });

    }

}

}));


export default useAuthStore;