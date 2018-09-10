import * as vscode from 'vscode';
import { Configuration } from "../components/Configuration";

import { Commands } from '../constants';
import { Errors } from '../errors';
import { WitcherScriptWrapper } from '../components/WitcherScriptWrapper';

export class LaunchGameCommand implements Command {
    constructor(private configuration: Configuration, private companionWrapper: WitcherScriptWrapper, private debug: boolean = false) {
    }

    execute() {
        let gamePath = this.configuration.GamePath;

        if (!gamePath) {
            vscode.window.showWarningMessage(Errors.GamePathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        this.companionWrapper.launchGame(gamePath, this.debug)
            .catch(error => vscode.window.showWarningMessage(error));
    }
}