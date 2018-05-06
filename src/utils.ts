import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ExtensionId } from './constants';
import { displayError, Errors } from './errors';

export function getModName(): string {
    return vscode.workspace.name;
}

export function isWitcherPackage(): boolean {
    if (fs.existsSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'witcher.package.json'))) {
        return true;
    }

    displayError(Errors.ModNotCreated);

    return false;
}

export function wscPath(): string {
    return path.join(vscode.extensions.getExtension(ExtensionId).extensionPath, '.wsc', 'wsc.exe');
}