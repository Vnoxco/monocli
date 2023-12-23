import chalk from "chalk";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import axios from "axios";
import FormData from "form-data";
import {RestClient} from "../../../RestClient.js";

export default {
    command: 'upload',
    description: 'Uploads all files in the current theme directory.',
    builder: {
        id: {
            description: 'ID of the theme to upload',
            demandOption: false,
            type: 'number',
        },
        store: {
            description: 'Store ID for upload',
            demandOption: false,
            type: 'string',
            alias: 's',
        },
    },
    handler: async (argv) => {
        let restClient = new RestClient();
        const __dirname = path.resolve();

        let id = argv.id;

        let storeId = argv.store;

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
                console.log(chalk.red('Please provide a theme id. For help run theme upload --help'))
            }
        }

        try {
            console.log(chalk.green('Uploading theme...'));
            const currentDirectoryName = path.basename(__dirname);

            const zipFileName = `${currentDirectoryName}.zip`;
            let tempPath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono', 'temp');
            let zipFilePath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono', 'temp', zipFileName);

            if (!fs.existsSync(tempPath)) {
                fs.mkdirSync(tempPath);
            }
            const output = fs.createWriteStream(zipFilePath);

            const archive = archiver('zip');

            archive.glob('**/*', {
                cwd: __dirname,
                dot: true,
            });

            archive.pipe(output);
            await archive.finalize();
            output.on('close', async () => {
                const fileBuffer = fs.readFileSync(zipFilePath);
                // Upload the zip file
                const uploadUrl = 'https://api.dev.gomonobill.com/api/developer/cli/themes';
                const formData = new FormData();
                formData.append('file', fs.createReadStream(zipFilePath), {filename: zipFileName}); // Append the file as a Buffer
                formData.append('id', id);
                formData.append('store_id', storeId);
                let headers = {
                    ...formData.getHeaders()
                };
                const hiddenFolderPath = path.join(process.env.HOME || process.env.USERPROFILE, '.mono');
                const filePath = path.join(hiddenFolderPath, 'access_token');
                let accessToken = null;

                if (fs.existsSync(filePath)) {
                    accessToken = fs.readFileSync(filePath, 'utf8').trim();
                }
                if (accessToken) {
                    headers['Authorization'] = 'Bearer ' + accessToken;
                }

                const uploadResponse = await axios.post(uploadUrl, formData, {
                    headers: headers,
                });

                console.log(chalk.green('Upload complete!'));

                // Delete the zip file
                fs.unlinkSync(zipFilePath);
            });
        } catch (e) {
            console.log(e.response)
            if (typeof e.response !== 'undefined') {
                console.log(chalk.red(e.response.data.error + ' ' + e.response.data.message));
            } else {
                console.log(e);
            }
        }
    }
}