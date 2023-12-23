import chalk from "chalk";
import path from "path";
import fs from "fs";
import git from "isomorphic-git/index.js";
import http from "isomorphic-git/http/node/index.js"
import {runCommand, runCommandSync} from "../../../RunCommand.js";
import { input } from '@inquirer/prompts';

export default {
    command: 'init [dir]',
    description: 'Initialize an app, downloading the latest example app from GitHub and setting the basic configurations',
    builder: (yargs) => {
        yargs.option('type', {
            description: 'Type of application, [laravel-vue]',
            demandOption: false,
            type: 'string',
            default: 'laravel-vue'
        }).option('dir', {
            description: 'Directory of which the app should be initialized',
            demandOption: false,
            type: 'string',
        }).option('f', {
            alias: 'force',
            description: 'Force the command to execute',
            type: 'boolean',
        });
    },
    handler: async (argv) => {
        const forceFlag = argv.f || false;
        const type = argv.type || 'laravel-vue';

        const composerCommand = 'composer install';

        let url = 'https://github.com/Vnoxco/monobill-app-laravel-vue.git';
        let directory = path.resolve();
        if (argv.dir) {
            directory = path.resolve(argv.dir)
        }

        //Check to see if the directory is empty
        fs.readdir(directory, async (err, files) => {
            if (err) {
                console.error(`Error reading directory ${directory}: ${err.message}`);
                return;
            }

            if (files.length !== 0 && !forceFlag) {
                console.log(chalk.red(`The directory ${directory} is not empty.`));
                return;
            }

            console.log(chalk.green('Downloading latest example app into ' + directory));

            switch (type.toLowerCase()) {
                case 'laravel-vue':
                default:
                    try {
                        console.log('Cloning ' + url);
                        // Clone the repository
                        await git.clone({
                            fs,
                            http,
                            dir: directory,
                            url: url,
                        });
                        runCommandSync('composer install');
                        runCommandSync("php -r \"copy('.env.example', '.env');\"");
                        runCommandSync('php artisan key:generate');

                        const appId = await input({ message: 'Enter the application\'s ID' });
                        const appSecret = await input({ message: 'Enter the application\'s secret' });

                        //Set the app id and secret in the env file
                        const envFilePath = path.join(directory, '.env');

                        const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
                        const updatedEnvFileContent = envFileContent.replace(
                            /^APP_ID=.*$/m,
                            'APP_ID=' + appId
                        ).replace(
                            /^APP_SECRET=.*$/m,
                            'APP_SECRET=' + appSecret
                        );
                        fs.writeFileSync(envFilePath, updatedEnvFileContent, 'utf-8');

                        console.log('App initialized successfully.');
                    } catch (error) {
                        console.error('Error cloning repository:', error);
                    }
                    break;
            }
        });
    }
}