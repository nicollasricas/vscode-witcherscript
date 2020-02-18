"use strict";

import * as vscode from "vscode";
import * as ws from "ws";
import * as net from "net";
import { GlobalState, ExtensionId, Commands, OutputChannelName } from "./constants";
import { Configuration } from "./components/Configuration";
import { WitcherScriptWrapper } from "./components/WitcherScriptWrapper";
import { LaunchGameCommand } from "./commands/LaunchGameCommand";
import { NewPackageCommand } from "./commands/NewPackageCommand";
import { CookCommand } from "./commands/CookCommand";
import { ImportScriptCommand } from "./commands/ImportScriptCommand";
import { ImportContentCommand } from "./commands/ImportContentCommand";
import { WelcomePageCommand } from "./commands/WelcomePageCommand";
import { SettingsPageCommand } from "./commands/SettingsPageCommand";
import { CompareScriptCommand } from "./commands/CompareScriptCommand";
import { UncookCommand } from "./commands/UncookCommand";
import { ContentPreview } from "./components/ContentPreview";

export async function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel(OutputChannelName);
    context.subscriptions.push(outputChannel);

    const contentPreview = new ContentPreview();

    const configuration = new Configuration();

    const wsc = new WitcherScriptWrapper(outputChannel);

    registerCommands(context, wsc, configuration, contentPreview);

    let extensionVersion = vscode.extensions.getExtension(ExtensionId).packageJSON.version;
    let extensionPreviousVersion = context.globalState.get<string>(GlobalState.WitcherScriptVersion);

    if (shouldShowWelcomePage(extensionVersion, extensionPreviousVersion)) {
        vscode.commands.executeCommand(Commands.ShowWelcomePage);
    }

    context.globalState.update(GlobalState.WitcherScriptVersion, extensionVersion);

    //const debugConfiguration = new DebugConfigurationProvider();
    //context.subscriptions.push(debugConfiguration);
    //context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('witcherscript', debugConfiguration));

    //implementing LSP...
    //context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('witcherscript', new WitcherScriptSignatureHelpProvider(), '(', ','));
    //context.subscriptions.push(vscode.languages.registerCompletionItemProvider('witcherscript', new WitcherScriptCompletionItemProvider()));
}

function registerCommands(
    context: vscode.ExtensionContext,
    wscWrapper: WitcherScriptWrapper,
    configuration: Configuration,
    contentPreview: ContentPreview
) {
    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.NewPackage, () => {
            new NewPackageCommand(wscWrapper).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.LaunchGame, debug => {
            new LaunchGameCommand(configuration, wscWrapper, debug).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.Cook, () => {
            new CookCommand(configuration, wscWrapper).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.Uncook, () => {
            new UncookCommand(configuration, wscWrapper).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.ImportScript, uri => {
            new ImportScriptCommand(configuration, uri).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.ImportContent, uri => {
            new ImportContentCommand(configuration, uri).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.ShowWelcomePage, () => {
            new WelcomePageCommand(contentPreview).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.ShowSettingsPage, () => {
            new SettingsPageCommand(contentPreview, configuration).execute();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.CompareScript, uri => {
            new CompareScriptCommand(configuration, uri).execute();
        })
    );
}

export function deactivate() {}

function shouldShowWelcomePage(currentVersion: string, previousVersion: string): boolean {
    if (previousVersion === undefined) {
        return true;
    }

    if (previousVersion !== currentVersion) {
        return true;
    }

    return false;
}
