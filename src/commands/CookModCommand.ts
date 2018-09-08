import * as utils from '../utils';
import * as vscode from 'vscode';
import { Commands } from '../constants';
import { Configuration } from '../components/Configuration';
import { WitcherScriptWrapper } from '../components/WitcherScriptWrapper';
import { Errors } from '../errors';

export class CookModCommand implements Command {
    constructor(private configuration: Configuration, private wrapper: WitcherScriptWrapper) {
    }

    execute() {
        if (!utils.isMod()) {
            vscode.window.showWarningMessage("Cook mod ins't avaiable since this is an mod");

            return;
        }

        let gamePath = this.configuration.GamePath;

        if (!gamePath) {
            vscode.window.showWarningMessage(Errors.GamePathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        let modKitPath = this.configuration.ModKitPath;

        if (!modKitPath) {
            vscode.window.showWarningMessage(Errors.ModKitPathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        let scriptMergerPath = this.configuration.ScriptMergerPath;

        let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        this.wrapper.cookMod(gamePath, modKitPath, workspacePath, scriptMergerPath)
            .then(() => {
                vscode.window.showInformationMessage('Mod cooked.', 'Launch Game').then(cmd => {
                    if (cmd) {
                        vscode.commands.executeCommand(Commands.LaunchGame);
                    }
                });
            })
            .catch(error => vscode.window.showWarningMessage(error));
    }
}