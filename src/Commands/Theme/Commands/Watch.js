import chalk from "chalk";
import fs from "fs";
import path from "path";
import Watcher from "watcher";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'watch',
    description: 'Watch directory for file changes and upload file automatically.',
    builder: (yargs) => {
        yargs.option('f', {
            alias: 'force',
            description: 'Force the command to execute',
            type: 'boolean',
        });
    },
    handler: async (argv) => {
        let restClient = new RestClient();
        let fileCache = {};

        const forceFlag = argv.f || false;
        const __dirname = path.resolve();
        const directories = ['assets', 'blocks', 'configuration', 'layouts', 'macros', 'sections', 'templates', 'translations'];

        const configPath = path.join(__dirname, '.mono', 'config.json');
        let config = null;
        if (fs.existsSync(configPath)) {
            config = fs.readFileSync(configPath, 'utf8').trim();
            config = JSON.parse(config);
        }
        if (config && config.theme_id) {
            //Check to see if this theme is live, if it is then require the -f flag to force watching.

            try {
                let response = await restClient.get('/themes/' + config.theme_id);
                if (response.content.theme.live) {
                    if (!forceFlag) {
                        console.log(chalk.red('This theme is live, you have to force the theme watcher to start with the "-f" flag.'))
                        return;
                    } else {
                        console.log(chalk.red('This theme is LIVE! Any changes done will automatically reflect on the live site.'))
                    }
                }
            } catch (e) {
                if (typeof e.response !== 'undefined') {
                    console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
                } else {
                    console.log(e);
                }
                return;
            }

            console.log(chalk.green("Watching this theme for changes"))
            const watcher = new Watcher(__dirname, {renameDetection: true, recursive: true});

            watcher.on('all', async (event, targetPath, targetPathNext) => {
                if (event === 'change') {
                    fs.readFile(targetPath, 'utf8', async (err, data) => {
                        if (err) {
                            console.error(`Error reading file ${targetPath}: ${err.message}`);
                            return;
                        }

                        const filename = path.basename(targetPath);
                        const directoryName = path.basename(path.dirname(targetPath));

                        if (directories.indexOf(directoryName) === -1) return;

                        if (typeof fileCache[directoryName + '/' + filename] !== 'undefined') {
                            if (fileCache[directoryName + '/' + filename] === data) return;
                        }

                        fileCache[directoryName + '/' + filename] = data;

                        try {
                            let response = await restClient.put('/themes/' + config.theme_id + '/file', {
                                file_name: filename,
                                directory: directoryName,
                                content: data
                            });
                            console.log(path.join(directoryName, filename) + ' uploaded successfully')
                        } catch (e) {
                            if (typeof e.response !== 'undefined') {
                                console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
                            } else {
                                console.log(e);
                            }
                        }
                    });
                }
                if (event === 'unlink') {
                    const filename = path.basename(targetPath);
                    const directoryName = path.basename(path.dirname(targetPath));

                    if (directories.indexOf(directoryName) === -1) return;

                    if (typeof fileCache[directoryName + '/' + filename] !== 'undefined') {
                        delete fileCache[directoryName + '/' + filename];
                    }
                    try {
                        let response = await restClient.delete('/themes/' + config.theme_id + '/file?file_name=' + filename + '&directory=' + directoryName);
                        console.log(path.join(directoryName, filename) + ' deleted successfully')
                    } catch (e) {
                        if (typeof e.response !== 'undefined') {
                            console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
                        } else {
                            console.log(e);
                        }
                    }
                }
                if (event === 'rename') {
                    const oldFilename = path.basename(targetPath);
                    const newFilename = path.basename(targetPathNext);
                    const directoryName = path.basename(path.dirname(targetPath));

                    if (directories.indexOf(directoryName) === -1) return;

                    if (typeof fileCache[directoryName + '/' + oldFilename] !== 'undefined') {
                        delete fileCache[directoryName + '/' + oldFilename];
                    }

                    try {
                        let response = await restClient.put('/themes/' + config.theme_id + '/file/rename', {
                            old_file_name: oldFilename,
                            new_file_name: oldFilename,
                            directory: directoryName,
                        });
                        console.log(path.join(directoryName, newFilename) + ' renamed successfully')
                    } catch (e) {
                        if (typeof e.response !== 'undefined') {
                            console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
                        } else {
                            console.log(e);
                        }
                    }
                }
            });
        } else {
            console.log('Theme id was not found in this directory. Are you sure this is a downloaded theme?');
        }
    }
}