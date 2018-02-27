'use strict';

import * as vscode from 'vscode';
import * as commands from './commands';
import * as utils from './utils';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    //context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.uncook', (args) => commands.uncook(args)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.cook', (args) => commands.cook(args)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.launch', (args) => commands.launch(args)));

    checkUpdates();
}

function checkUpdates() {
    if (!utils.hasCompationInstalled()) {
        return;
    }

    child_process.exec('wsc --checkupdate', (error, stdout, stderr) => {
        if (stdout) {
            vscode.window.showInformationMessage(stdout);
        }
    });
}

export function deactivate() {
}