import axios from "axios";
import { toast } from "react-toastify";

import configFile from "../../config.json";
import authService from "./auth.service";
import {
    getRefreshToken,
    getTokenExpiresDate,
    getAccessToken,
    setTokens
} from "./localStorage.service";

const http = axios.create({
    baseURL: configFile.API_BASE_URL
});

http.interceptors.request.use(
    async function (config) {
        let expiresDate = getTokenExpiresDate();
        let refreshToken = getRefreshToken();
        let isExpired = refreshToken && expiresDate < Date.now();

        if (isExpired) {
            try {
                const data = await authService.refresh();
                expiresDate = getTokenExpiresDate();
                refreshToken = getRefreshToken();
                isExpired = refreshToken && expiresDate < Date.now();
                if (isExpired) setTokens(data);
            } catch (error) {
                console.error(error.message);
            }
        }
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    res => {
        res.data = { content: res.data };
        return res;
    },
    error => {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            console.error(error.message);
            toast.error("Что-то пошло не так, попробуйте позже.");
        }
        return Promise.reject(error);
    }
);

const httpService = {
    get: http.get,
    post: http.post,
    patch: http.patch,
    delete: http.delete
};

export default httpService;
