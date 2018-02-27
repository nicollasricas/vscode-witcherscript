import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as errors from './errors';
import * as fs from 'fs';
import * as path from 'path';

export function hasCompationInstalled(): boolean {
    try {
        return child_process.execSync('wsc --ready').toString() == 'ready';
    } catch {
        errors.show(errors.CompanionAppNotInstalled);

        return false;
    }
}

export function getGamePath(): string {
    let gamePath = <string>vscode.workspace.getConfiguration().get('witcherscript.gamePath');

    if (!gamePath) {
        errors.show(errors.GamePathNotSetted);

        return "";
    }

    return gamePath;
}

export function getModKitPath(): string {
    let modKitPath = <string>vscode.workspace.getConfiguration().get('witcherscript.modKitPath');

    if (!modKitPath) {
        errors.show(errors.ModKitPathNotSetted);

        return "";
    }

    return modKitPath;
}

export function getModMergerPath(): string {
    let modMergerPath = <string>vscode.workspace.getConfiguration().get('witcherscript.modMergerPath');

    if (!modMergerPath) {
        return "";
    }

    return modMergerPath;
}

export function isWitcherPackage(): boolean {
    try {
        fs.accessSync(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'witcher.package.json'));

        return true;
    }
    catch
    {
        errors.show(errors.ModNotCreated);

        return false;
    }
}