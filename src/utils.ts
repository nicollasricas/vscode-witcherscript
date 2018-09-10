import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Commands, ExtensionId } from './constants';
import { Errors, errorToString } from './errors';

export function getModName(): string {
    return vscode.workspace.name;
}

export function isMod(): boolean {
    if (!vscode.workspace.workspaceFolders) {
        return false;
    }

    if (!fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'witcher.package.json'))) {
        vscode.window.showInformationMessage(errorToString(Errors.ModIsRequired), 'New Package').then((selection => {
            if (selection) {
                vscode.commands.executeCommand(Commands.NewPackage);
            }
        }));

        return false;
    }

    return true;
}