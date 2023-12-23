import login from "./Commands/Login.js"
import logout from "./Commands/Logout.js"
import who from "./Commands/Who.js"

const commands = [
    login,
    logout,
    who
]

export default {
    command: 'auth',
    description: 'Login, logout and see who\'s currently authenticated.',
    builder: (yargs) => {
        commands.forEach((command) => {
            yargs.command(command.command, command.description,
                (yargs) => {
                    if (typeof command.builder !== 'function') return;
                    command.builder(yargs)
                },
                (argv) => {
                    if (typeof command.handler !== 'function') return;
                    command.handler(argv)
                });
        });
        yargs.demandCommand(1)
    },
    commands: commands
}