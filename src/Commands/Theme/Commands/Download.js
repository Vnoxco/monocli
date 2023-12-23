import chalk from "chalk";
import fs from "fs";
import path from "path";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'download [id]',
    description: 'Download a theme by ID. If the working directory is a MonoBill theme and the config file is present, the ID is not required.',
    builder: {
        id: {
            description: 'ID of the theme to download',
            demandOption: false,
            type: 'number',
        },
    },
    handler: async (argv) => {
        let restClient = new RestClient();
        const __dirname = path.resolve();

        let id = argv.id;

        if (!id) {
            const configPath = path.join(__dirname, '.mono', 'config.json');
            let config = null;

            if (fs.existsSync(configPath)) {
                config = fs.readFileSync(configPath, 'utf8').trim();
                config = JSON.parse(config);
            }

            if (config && config.theme_id) {
                id = config.theme_id;
            } else {
                console.log(chalk.red('Please provide a theme id. For help run theme download --help'))
            }
        }
        try {
            let response = await restClient.get('/themes/' + id + ' /files');


            //Create folder for  this theme
            const folderPath = path.join(__dirname, response.content.theme_name);
            if (!fs.existsSync(folderPath)) {
                console.log('Creating directory')
                fs.mkdirSync(folderPath);
            }

            const configPath = path.join(__dirname, response.content.theme_name, '.mono');
            if (!fs.existsSync(configPath)) {
                console.log('Creating config folder')
                fs.mkdirSync(configPath);
            }

            console.log('Writing config file')
            const configFilePath = path.join(configPath, 'config.json');
            fs.writeFileSync(configFilePath, JSON.stringify({
                theme_id: id
            }));

            response.content.files.forEach((themeFile) => {
                let type = themeFile.file_type;
                if (type !== 'configuration') {
                    type += 's';
                }

                let fileFolderPath = path.join(folderPath, type);
                if (!fs.existsSync(fileFolderPath)) {
                    console.log('Creating folder ' + fileFolderPath)
                    fs.mkdirSync(fileFolderPath);
                }

                const filePath = path.join(folderPath, type, themeFile.file_name);
                console.log('Writing file ' + filePath);
                fs.writeFileSync(filePath, (themeFile.file_content) ? themeFile.file_content : '');
            });
            console.log(chalk.green('Theme "' + response.content.theme_name + '" downloaded successfully'));
        } catch (e) {
            if (typeof e.response !== 'undefined') {
                console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
            } else {
                console.log(e);
            }
        }
    },
}