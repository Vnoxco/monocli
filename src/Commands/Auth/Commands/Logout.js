import chalk from "chalk";
import fs from "fs";
import path from "path";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'logout',
    description: 'Logout of your MonoBill account.',
    handler: async (argv) => {
        let restClient = new RestClient();
        let response = null;
        try {
            response = await restClient.get('/logout');
        } catch (e) {
            console.log(chalk.red(e.response.data.message));
            return;
        }

        const hiddenFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono');
        if (!fs.existsSync(hiddenFolderPath)) {
            fs.mkdirSync(hiddenFolderPath);
        }
        const filePath = path.join(hiddenFolderPath, 'access_token');

        fs.unlinkSync(filePath);

        console.log(chalk.green('Logged out successfully!'));
    }
}