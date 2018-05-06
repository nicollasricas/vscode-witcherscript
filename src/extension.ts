'use strict';

import * as vscode from 'vscode';
import * as commands from './commands';
import * as utils from './utils';
import * as child_process from 'child_process';
import { RuntimeDependencyInstaller } from './RuntimeDependencyInstaller';
import { GlobalState, ExtensionId, Commands, ExtensionScheme } from './constants';
import { read } from 'fs';
import { Configuration, configuration } from './configuration';

export async function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Commands.Cook, () => commands.cookMod()));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.Launch, () => commands.launchGame()));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportScript, (args) => commands.importScript(args)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportContent, (args) => commands.importContent(args)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowWelcomePage, () => commands.showWelcomePage()));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowSettingsPage, () => commands.showSettingsPage()));

    let currentVersion = vscode.extensions.getExtension(ExtensionId).packageJSON.version;
    let previousVersion = context.globalState.get<string>(GlobalState.WitcherScriptVersion);

    if (shouldShowWelcomePage(currentVersion, previousVersion)) {
        vscode.commands.executeCommand(Commands.ShowWelcomePage);

        // if (!await ensureRuntimeDependencies(extension.packageJSON, context.extensionPath)) {
        //     vscode.window.showErrorMessage('It was not possible to install Witcher Script Companion, a dependency to most of the features offered by the Witcher Script extension, you can try to install manually.', 'Download manually').then(sel => {
        //         if (sel == 'Download manually') {
        //             vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://github.com/nicollasricas/vscode-witcherscript-companion/releases'));
        //         }
        //     });
        // }
    }

    context.globalState.update(GlobalState.WitcherScriptVersion, currentVersion);

    Configuration.configure();
}

function shouldShowWelcomePage(currentVersion: string, previousVersion: string): boolean {
    if (previousVersion == undefined) {
        return true;
    }

    if (previousVersion !== currentVersion) {
        return true;
    }

    return false;
}

// function ensureRuntimeDependencies(packageJSON: any, extensionPath: string): Promise<boolean> {
//     return new Promise<boolean>((resolve, reject) => {
//         try {
//             new RuntimeDependencyInstaller(packageJSON, extensionPath).install();

//             resolve(true);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

export function deactivate() {
}