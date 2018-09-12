'use strict';

import * as vscode from 'vscode';
import { GlobalState, ExtensionId, Commands } from './constants';
import { Configuration } from './components/Configuration';
import { WitcherScriptWrapper } from './components/WitcherScriptWrapper';
import { LaunchGameCommand } from './commands/LaunchGameCommand';
import { NewPackageCommand } from './commands/NewPackageCommand';
import { CookCommand } from './commands/CookCommand';
import { ImportScriptCommand } from './commands/ImportScriptCommand';
import { ImportContentCommand } from './commands/ImportContentCommand';
import { WelcomePageCommand } from './commands/WelcomePageCommand';
import { SettingsPageCommand } from './commands/SettingsPageCommand';
import { CompareScriptCommand } from './commands/CompareScriptCommand';
import { UncookCommand } from './commands/UncookCommand';
import { CommandTreeView } from './components/CommandTreeView';
import { ContentPreview } from './components/ContentPreview';

export async function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Witcher Script');

    context.subscriptions.push(outputChannel);

    const contentPreview = new ContentPreview();

    const configuration = new Configuration();

    const companionWrapper = new WitcherScriptWrapper(outputChannel);

    registerCommands(context, companionWrapper, configuration, contentPreview);

    let extensionVersion = vscode.extensions.getExtension(ExtensionId).packageJSON.version;
    let extensionPreviousVersion = context.globalState.get<string>(GlobalState.WitcherScriptVersion);

    if (shouldShowWelcomePage(extensionVersion, extensionPreviousVersion)) {
        vscode.commands.executeCommand(Commands.ShowWelcomePage);
    }

    context.globalState.update(GlobalState.WitcherScriptVersion, extensionVersion);

    //tree view test for debug
    //const commandTreeView = new CommandTreeView();
    //vscode.window.registerTreeDataProvider('witcherscript-commandtreeview', commandTreeView);

    //implementing LSP...
    //context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('witcherscript', new WitcherScriptSignatureHelpProvider(), '(', ','));
    //context.subscriptions.push(vscode.languages.registerCompletionItemProvider('witcherscript', new WitcherScriptCompletionItemProvider()));
}

function registerCommands(context: vscode.ExtensionContext, companionWrapper: WitcherScriptWrapper, configuration: Configuration, contentPreview: ContentPreview) {
    context.subscriptions.push(vscode.commands.registerCommand(Commands.NewPackage, () => {
        new NewPackageCommand(companionWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.LaunchGame, (debug) => {
        new LaunchGameCommand(configuration, companionWrapper, debug).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.Cook, () => {
        new CookCommand(configuration, companionWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.Uncook, () => {
        new UncookCommand(configuration, companionWrapper).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportScript, (uri) => {
        new ImportScriptCommand(configuration, uri).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.ImportContent, (uri) => {
        new ImportContentCommand(configuration, uri).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowWelcomePage, () => {
        new WelcomePageCommand(contentPreview).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.ShowSettingsPage, () => {
        new SettingsPageCommand(contentPreview, configuration).execute();
    }));

    context.subscriptions.push(vscode.commands.registerCommand(Commands.CompareScript, (uri) => {
        new CompareScriptCommand(configuration, uri).execute();
    }));
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