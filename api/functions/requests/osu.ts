import axios, { Axios, AxiosResponse } from "axios";
import querystring from "querystring";
import * as database from "./../../../database/database";
import { modwebUser, osuApiBeatmaps, osuUserApiResponse, osuUserToken } from "../../../types/types";

export async function getUserToken(token:string):Promise<osuUserToken> {
    const postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: token,
        redirect_uri: process.env.REDIRECT_URI  ,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    });
    try {
        const request = await axios({
            method: "post",
            url: "https://osu.ppy.sh/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: postData,
        });
        return Promise.resolve(request.data);
    } catch (error:any) {
        return Promise.resolve(error);
    }
}

export async function getNewTokenByRefresh(token:string):Promise<osuUserToken> {
    const postData = querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
    });

    try {
        const request = await axios({
            method: "post",
            url: "https://osu.ppy.sh/oauth/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: postData,
        });
        return Promise.resolve(request.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getUserInfo(access_token:string) {
    try {
        const res:AxiosResponse<osuUserApiResponse> = await axios({
            method: 'GET',
            url: 'https://osu.ppy.sh/api/v2/me',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return Promise.resolve(res.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function fetchUserBeatmaps(user_id:string) {
    try {
        let user:modwebUser = await database.users.findOne({ _id: user_id });

        if (user == null) return Promise.reject({ code: 404, message: "User not found!" })        

        const res:AxiosResponse<osuApiBeatmaps> = await axios({
            method: 'GET',
            url: `https://osu.ppy.sh/api/v2/users/${user_id}/beatmapsets/pending?limit=20`,
            headers: {
                Authorization: `Bearer ${user["access_token"]}`,
            },
        });

        let maps = res.data;
        let formattedObjects:Array<Object> = [];

        for (let i = 0; i< maps.length; i++) {
            let response = await axios({
                method: 'GET',
                url: `https://osu.ppy.sh/api/v2/beatmapsets/${maps[i].id}`,
                headers: {
                    Authorization: `Bearer ${user["access_token"]}`,
                },
            });
            formattedObjects.push(response.data)
        }

        return Promise.resolve(formattedObjects);
    } catch (error) {
        return Promise.reject(error);
    }
}