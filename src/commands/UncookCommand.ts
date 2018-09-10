import * as vscode from 'vscode';
import { Configuration } from '../components/Configuration';
import { WitcherScriptWrapper } from '../components/WitcherScriptWrapper';
import { Errors } from '../errors';
import { Commands } from '../constants';

export class UncookCommand implements Command {
    constructor(private configuration: Configuration, private companionWrapper: WitcherScriptWrapper, private debug: boolean = false) {
    }

    execute() {
        let modKitPath = this.configuration.ModKitPath;

        if (!modKitPath) {
            vscode.window.showWarningMessage(Errors.ModKitPathIsRequired);

            vscode.commands.executeCommand(Commands.ShowSettingsPage);

            return;
        }

        vscode.window.showQuickPick(['png', 'jpg', 'tga', 'dds', 'bmp'], {
            placeHolder: 'Select the texture format to uncook',
            canPickMany: false
        }).then(textureFormat => {
            if (textureFormat) {
                vscode.window.showQuickPick(['No', 'Yes'], {
                    placeHolder: 'Dump SWF files?',
                    canPickMany: false
                }).then(dumpSWF => {
                    if (dumpSWF) {
                        vscode.window.showQuickPick(['Yes', 'No'], {
                            placeHolder: 'Skip errors?',
                            canPickMany: false
                        }).then(skipErrors => {
                            if (skipErrors) {
                                this.companionWrapper.uncook(modKitPath, textureFormat, dumpSWF == 'Yes', skipErrors == 'Yes')
                                    .catch(error => vscode.window.showWarningMessage(error));
                            }
                        });
                    }
                });
            }
        });
    }
}