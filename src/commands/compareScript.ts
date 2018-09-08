import * as vscode from 'vscode';
import { Configuration } from '../components/Configuration';
import * as path from 'path';
import * as utils from '../utils';

export function compareScript(configuration: Configuration, args: any) {
    // check if it is a mod if not cancel the compare script

    //let configuration = <Configuration>container.resolve(Components.Configuration);

    if (!args || !args.fsPath) {
        return;
    }

    if (!vscode.workspace.workspaceFolders[0]) {
        return;
    }

    if (!utils.isMod()) {
        return;
    }

    let gamePath = configuration.GamePath;

    if (!gamePath) {
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let right = args.fsPath.replace(path.join(workspacePath, utils.getModName()), path.join(gamePath, 'content/content0'));

    vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(args.fsPath), vscode.Uri.file(right), `Diff ${path.basename(args.fsPath)} (Head/Original)`, {});
}