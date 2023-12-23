import chalk from "chalk";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'list',
    description: 'List all stores on your MonoBil account, development stores and live stores.',
    handler: async () => {
        let restClient = new RestClient();
        try {
            let response = await restClient.get('/stores');
            response.content.stores.forEach((store) => {
                console.log(chalk.green(store.name) + ' : ' + store.uuid)
            });
        } catch (e) {
            console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
        }
    }
}