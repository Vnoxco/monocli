import chalk from "chalk";
import {RestClient} from "../../../RestClient.js";
export default {
    command: 'list',
    description: 'List all themes on your MonoBill account, development themes and themes installed on stores.',
    handler: async () => {
        let restClient = new RestClient();
        try {
            let response = await restClient.get('/themes');
            let storeName = null;
            response.content.store_themes.forEach((theme) => {
                if (!storeName || storeName !== theme.store_name) {
                    if (storeName) {
                        console.log('');
                    }
                    console.log(chalk.green(theme.store_name))
                    storeName = theme.store_name;
                }
                let liveStr = '';
                if (theme.live) {
                    liveStr = chalk.redBright('[LIVE] ');
                }
                console.log(theme.id + ': ' + liveStr + theme.name)
            });
        } catch (e) {
            console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
        }
    }
}