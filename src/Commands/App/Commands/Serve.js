import path from "path";
import fs from "fs";
import {runCommand, runCommandSync} from "../../../RunCommand.js";
import app from "../index.js";

export default {
    command: 'serve',
    description: 'Start development processes and open a tunnel',
    builder: (yargs) => {
        yargs.option('tunnel', {
            description: 'Specify the tunnel software to use. [ngrok]',
            demandOption: false,
            type: 'string',
            default: 'ngrok'
        }).option('tunnel-url', {
            description: 'Specify the url that the tunnel should run on.',
            demandOption: true,
            type: 'string',
        }).option('app-port', {
            description: 'Specify the port that the app should run on locally.',
            demandOption: false,
            type: 'number',
            default: 8001
        });
    },
    handler: async (argv) => {
        const __dirname = path.resolve();
        //Check to see if this is a laravel app. Look for artisan in the current directory.

        let appProcess = null;
        let tunnelProcess = null;

        let port = argv['app-port'] ?? 8001;

        if (fs.existsSync(path.join(__dirname, 'artisan'))) {
            //This is a laravel app.
            console.log('Starting php server')
            appProcess = runCommand('php artisan serve --port=' + port)
            runCommandSync('npm install')
            runCommand('npm run dev')
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        if (appProcess) {
            switch (argv.tunnel) {
                case 'ngrok':
                default:
                    console.log('Opening tunnel with ngrok')
                    let ngrokCommand = 'ngrok http'
                    if (typeof argv['tunnel-url'] !== 'undefined') {
                        ngrokCommand += ' --domain=' + argv['tunnel-url']
                    }
                    ngrokCommand += ` ${port}`
                    tunnelProcess = runCommand(ngrokCommand)
                    break;
            }
        }
    }
}