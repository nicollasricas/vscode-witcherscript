import * as path from 'path';
import * as vscode from 'vscode';
import { Configuration } from '../components/Configuration';
import * as utils from '../utils';

export class CompareScriptCommand implements Command {
    constructor(private configuration: Configuration, private uri: vscode.Uri) {

    }

    execute() {
        if (!this.uri || !this.uri.fsPath) {
            return;
        }

        if (!vscode.workspace.workspaceFolders[0]) {
            return;
        }

        if (!utils.isMod()) {
            return;
        }

        let gamePath = this.configuration.GamePath;

        if (!gamePath) {
            return;
        }

        let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        let right = this.uri.fsPath.replace(path.join(workspacePath, utils.getModName()), path.join(gamePath, 'content/content0'));

        vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(this.uri.fsPath), vscode.Uri.file(right), `Diff ${path.basename(this.uri.fsPath)} (Head/Original)`, {});
    }
}