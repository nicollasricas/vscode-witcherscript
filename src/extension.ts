'use strict';

import * as vscode from 'vscode';
import { GlobalState, ExtensionId, Commands } from './constants';
import { Configuration } from './components/Configuration';
import { WitcherScriptWrapper } from './components/WitcherScriptWrapper';
import { LaunchGameCommand } from './commands/LaunchGameCommand';
import { NewModCommand } from './commands/NewModCommand';
import { CookModCommand } from './commands/CookModCommand';
import { importScript } from './commands/importScript';
import { importContent } from './commands/importContent';
import { showWelcomePage } from './commands/showWelcomePage';
import { showSettingsPage } from './commands/showSettingsPage';
import { compareScript } from './commands/compareScript';
import { UncookCommand } from './commands/UncookCommand';

/*
cooking mod => progress notification
deploy mod => progress notification

Cooking Mod :
Add progress notification through role cooking proccess
Cooking process now only cook if theres a change between content folder
Change only scripts will always deploy

Launch Game Command:
Add an option to run with debug parameters -net -debugscripts
Check if theres an game .exe already running.
*/

export async function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Witcher Script');

    context.subscriptions.push(outputChannel);

    const configuration = new Configuration();

    const witcherScriptWrapper = new WitcherScriptWrapper(outputChannel);

    context.subscriptions.push(vscode.commands.registerCommand(Commands.NewMod, () => {
        new NewModCommand(witcherScriptWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.LaunchGame, (debug) => {
        new LaunchGameCommand(configuration, witcherScriptWrapper, debug).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.CookMod, () => {
        new CookModCommand(configuration, witcherScriptWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.Uncook, () => {
        new UncookCommand(configuration, witcherScriptWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportScript, (args) => importScript(configuration, args)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportContent, (args) => importContent(configuration, args)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowWelcomePage, () => showWelcomePage()));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowSettingsPage, () => showSettingsPage(configuration)));
    context.subscriptions.push(vscode.commands.registerCommand(Commands.CompareScript, (args) => compareScript(configuration, args)));

    let extensionVersion = vscode.extensions.getExtension(ExtensionId).packageJSON.version;
    let extensionPreviousVersion = context.globalState.get<string>(GlobalState.WitcherScriptVersion);

    if (shouldShowWelcomePage(extensionVersion, extensionPreviousVersion)) {
        vscode.commands.executeCommand(Commands.ShowWelcomePage);
    }

    context.globalState.update(GlobalState.WitcherScriptVersion, extensionVersion);

    //implementing LSP...
    //context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('witcherscript', new WitcherScriptSignatureHelpProvider(), '(', ','));
    //context.subscriptions.push(vscode.languages.registerCompletionItemProvider('witcherscript', new WitcherScriptCompletionItemProvider()));
}

export function deactivate() {
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