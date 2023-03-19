import axios from "axios";

import localStorageService from "./localStorage.service";
import configFile from "../../config.json";

const httpAuth = axios.create({
    baseURL: configFile.API_BASE_URL + "auth/"
});

const authService = {
    register: async payload => {
        const { data } = await httpAuth.post("signUp", payload);
        return data;
    },
    login: async ({ email, password }) => {
        const { data } = await httpAuth.post("signInWithPassword", {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    refresh: async () => {
        // todo: Проверить обновление refreshToken (и сравнить с базой и с localStorage)
        // как будто все работает
        console.log(localStorageService.getRefreshToken());

        const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });

        console.log(data.refreshToken);

        return data;
    }
};

export default authService;
