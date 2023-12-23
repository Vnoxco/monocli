import {exec, execSync} from "child_process";

export function runCommand(command, func) {
    const child = exec(command, {encoding: 'utf-8'}, func);
    child.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    child.stderr.on('data', (data) => {
        console.error(`${data}`);
    });
    child.on('close', (code) => {
    });
    return child;
}

export function runCommandSync(command) {
    const result = execSync(command, {encoding: 'utf-8'});

    // Split the output into lines and log each line
    const lines = result.trim().split('\n');
    lines.forEach((line) => {
        console.log(line);
    });
}