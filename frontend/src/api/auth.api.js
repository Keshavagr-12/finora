import api from "./axios";


export const registerAPI = async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;

};


export const loginAPI = async (credentials) => {

    const response = await api.post(
        "/auth/login",
        credentials
    );

    return response.data;

};


export const refreshAPI = async () => {

    const response = await api.post(
        "/auth/refresh"
    );

    return response.data;

};


export const getMeAPI = async (accessToken) => {

    const response = await api.get(
        "/auth/me",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;

};


export const logoutAPI = async () => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;

};


export const logoutAllAPI = async (accessToken) => {

    const response = await api.post(
        "/auth/logout-all",
        null,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;

};