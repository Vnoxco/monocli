import list from "./Commands/List.js";

const commands = [list]

export default {
    command: 'store',
    description: 'A set of commands to help you manage your connected stores.',
    commands: commands
}