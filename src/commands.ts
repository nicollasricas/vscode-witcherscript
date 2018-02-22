import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as utils from './utils';
import * as util from 'util';
import * as errors from './errors';

export function launch(args: any[]) {
    if (!utils.hasCompationInstalled()) {
        return;
    }

    let gamePath = utils.getGamePath();

    if (!gamePath) {
        return;
    }

    // wsc --launch gamePath
    child_process.exec(util.format('wsc --launch "%s"', gamePath), (err, stdout, stderr) => {
        if (stderr) {
            errors.show(stderr);
        }
    });
}

export function cook(args: any[]) {
    if (!utils.hasCompationInstalled()) {
        return;
    }

    if (!utils.isWitcherPackage()) {
        return;
    }

    let gamePath = utils.getGamePath();
    let modKitPath = utils.getModKitPath();

    if (!gamePath || !modKitPath) {
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // wsc --cook gamePath modKitPath workspacePath
    child_process.exec(util.format('wsc --cook "%s" "%s" "%s"', gamePath, modKitPath, workspacePath), (err, stdout, stderr) => {
        if (stderr) {
            errors.show(stderr);
        }
    });
}

export function uncook(args: any[]) {
}

export function publish(args: any[]) {
}