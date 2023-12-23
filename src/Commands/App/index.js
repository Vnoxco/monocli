import init from "./Commands/Init.js";
import serve from "./Commands/Serve.js";

const commands = [init, serve]

export default {
    command: 'app',
    description: 'A set of commands to help you develop apps for MonoBill.',
    commands: commands
}