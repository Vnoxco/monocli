import chalk from "chalk";
import open from "open";
import path from "path";
import fs from "fs";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'login',
    description: 'Login to your MonoBill account.',
    handler: async (argv) => {
        let restClient = new RestClient();
        let tries = 24;

        let response = null;
        try {
            response = await restClient.get('/login');
        } catch (e) {
            console.log(chalk.red(e.response.data.message));
            return;
        }

        let link = 'https://accounts.monobill.com/login?clc=' + response.content.login_code;

        open(link);

        console.log('If your browser did not automatically open click this link: ' + chalk.green(link))

        let loggedIn = false;

        console.log('Waiting for you to login and accept this CLI connection...')
        async function checkLogin() {
            try {
                let codeCheckRes = await restClient.get('/login-check?login_code=' + response.content.login_code);
                const hiddenFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono');
                if (!fs.existsSync(hiddenFolderPath)) {
                    fs.mkdirSync(hiddenFolderPath);
                }
                const filePath = path.join(hiddenFolderPath, 'access_token');
                fs.writeFileSync(filePath, codeCheckRes.content.access_token);
                console.log(chalk.green('Login success!'));
                loggedIn = true;
            } catch (e) {}
        }

        let currentTries = 0;

        while (!loggedIn) {
            currentTries++;
            await checkLogin();
            if(loggedIn) break;
            if(currentTries >= tries) break;
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}