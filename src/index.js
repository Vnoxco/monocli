#!/usr/bin/env node
import yargs from "yargs";
import auth from "./Commands/Auth/index.js";
import theme from "./Commands/Theme/index.js";
import store from "./Commands/Store/index.js";
import app from "./Commands/App/index.js";

const commands = [auth, theme, app, store]

const argv = yargs(process.argv.splice(2))
    .scriptName("mono")

commands.forEach((command) => {
    argv.command(command.command, command.description, (yargs) => {
        command.commands.forEach((command) => {
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
        yargs.strict()
        yargs.demandCommand(1)
    }, command.handler)
});

argv.demandCommand().recommendCommands().help().argv