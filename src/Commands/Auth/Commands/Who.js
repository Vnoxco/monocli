import chalk from "chalk";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'who',
    description: 'Shows which MonoBill account is currently authenticated.',
    handler: async (argv) => {
        try {
            let response = await new RestClient().get('/who');
            console.log(chalk.green(response.content.email_address + ' : ' + response.content.name));
        } catch (e) {
            console.log(chalk.red(e.response.data.message));
        }
    },
}