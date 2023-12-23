import download from "./Commands/Download.js";
import list from "./Commands/List.js";
import open from "./Commands/Open.js";
import upload from "./Commands/Upload.js";
import watch from "./Commands/Watch.js";

const commands = [download, list, open, upload, watch]

export default {
    command: 'theme',
    description: 'A set of commands to help you develop themes faster for MonoBill.',
    commands: commands
}