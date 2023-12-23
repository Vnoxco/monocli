import axios from "axios";
import path from "path";
import fs from "fs";

export class RestClient {
    constructor(baseURL) {
        if(!baseURL) {
            baseURL = "https://api.dev.gomonobill.com/api/developer/cli";
        }
        const hiddenFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono');
        const filePath = path.join(hiddenFolderPath, 'access_token');
        let accessToken = null;
        if (fs.existsSync(filePath)) {
            accessToken = fs.readFileSync(filePath, 'utf8').trim();
        }
        let config = {
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        };

        if (accessToken) {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
        }

        this.client = axios.create(config);
    }

    async get(url) {
        const response = await this.client.get(url);
        return response.data;
    }

    async post(url, data) {
        const response = await this.client.post(url, data);
        return response.data;
    }

    async put(url, data) {
        const response = await this.client.put(url, data);
        return response.data;
    }

    async delete(url) {
        const response = await this.client.delete(url);
        return response.data;
    }
}