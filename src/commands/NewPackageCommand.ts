import * as vscode from 'vscode';
import { WitcherScriptWrapper } from '../components/WitcherScriptWrapper';

export class NewPackageCommand implements Command {
    constructor(private companionWrapper: WitcherScriptWrapper) {
    }

    execute() {
        vscode.window.showInputBox({
            prompt: 'Package name',
            placeHolder: 'Ex.: modWitcherImproved'
        }).then(packageName => {
            if (packageName) {
                this.companionWrapper.newMod(packageName)
                    .then(packagePath => vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.parse(packagePath), false))
                    .catch(error => vscode.window.showWarningMessage(error));
            }
        });
    }
}