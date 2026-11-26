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


export const getMeAPI = async () => {

    const response = await api.get(
        "/auth/me"
    );

    return response.data;

};


export const logoutAPI = async () => {

    const response = await api.post(
        "/auth/logout"
    );

    return response.data;

};


export const logoutAllAPI = async () => {

    const response = await api.post(
        "/auth/logout-all"
    );

    return response.data;

};