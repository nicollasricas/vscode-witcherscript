import * as vscode from 'vscode';
import { WitcherScriptWrapper } from '../components/WitcherScriptWrapper';

export class NewModCommand implements Command {
    constructor(private wrapper: WitcherScriptWrapper) {
    }

    execute() {
        vscode.window.showInputBox({
            prompt: 'Mod name',
            placeHolder: 'Ex.: modWitcherImproved'
        }).then(modName => {
            if (modName) {
                this.wrapper.newMod(modName)
                    .then(modPath => vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.parse(modPath), false))
                    .catch(error => vscode.window.showWarningMessage(error));
            }
        });
    }
}