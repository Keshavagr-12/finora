import { create } from "zustand";

import {
    registerAPI,
    loginAPI,
    logoutAPI,
    logoutAllAPI
} from "../api/auth.api";

import {
    getErrorMessage
} from "../utils/getErrorMessage";


const useAuthStore = create((set, get) => ({

    // Authentication state

    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: false,

    isInitialized: false,

    error: null,


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

            const accessToken = get().accessToken;

            const response = await logoutAllAPI(
                accessToken
            );

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