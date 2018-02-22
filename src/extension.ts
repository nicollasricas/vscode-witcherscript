'use strict';

import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    //context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.uncook', (args) => commands.uncook(args)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.cook', (args) => commands.cook(args)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.launch', (args) => commands.launch(args)));
    //context.subscriptions.push(vscode.commands.registerCommand('extension.witcherscript.publish', (args) => commands.publish(args)));
}

export function deactivate() {
}