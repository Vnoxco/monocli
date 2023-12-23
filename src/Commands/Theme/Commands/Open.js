import chalk from "chalk";
import open from "open";
import fs from "fs";
import path from "path";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'open',
    description: 'Open the theme in preview mode',
    handler: async (argv) => {
        let restClient = new RestClient();
        const __dirname = path.resolve();
        const directories = ['assets', 'blocks', 'configuration', 'layouts', 'macros', 'sections', 'templates', 'translations'];
        const configPath = path.join(__dirname, '.mono', 'config.json');
        let config = null;
        if (fs.existsSync(configPath)) {
            config = fs.readFileSync(configPath, 'utf8').trim();
            config = JSON.parse(config);
        }

        if (config && config.theme_id) {
            try {
                let response = await restClient.get('/themes/' + config.theme_id);
                if (response.content.preview_url) {
                    console.log('If the webpage did not open automatically use the following link: ' + response.content.preview_url)
                    await open(response.content.preview_url);
                }
            } catch (e) {
                if (typeof e.response !== 'undefined') {
                    console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
                } else {
                    console.log(e);
                }
            }
        } else {
            console.log('Theme id was not found in this directory. Are you sure this is a downloaded theme?');
        }
    }
}