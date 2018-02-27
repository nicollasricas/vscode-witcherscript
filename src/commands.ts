import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as utils from './utils';
import * as util from 'util';
import * as errors from './errors';
import * as fs from 'fs';
import * as path from 'path';

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

function _cook(gamePath: string, modKitPath: string, workspacePath: string, modMergerPath: string) {
    // wsc --cook gamePath modKitPath workspacePath modMergerPath
    child_process.exec(util.format('wsc --cook "%s" "%s" "%s" "%s"', gamePath, modKitPath, workspacePath, modMergerPath), (err, stdout, stderr) => {
        if (stderr) {
            errors.show(stderr);
        } else {
            vscode.window.showInformationMessage('Mod cooked, launch game?', 'Yes', 'No').then(selection => {
                if (selection == 'Yes') {
                    vscode.commands.executeCommand('extension.witcherscript.launch');
                }
            });
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
    let modMergerPath = utils.getModMergerPath();

    if (!gamePath || !modKitPath) {
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let mods = fs.readdirSync(path.join(gamePath, "mods"));

    if (mods && mods.length > 1) {
        vscode.window.showInformationMessage('It appears that you have more than one mod installed, are you sure you wanna cook this mod? it may force you to merge all changed content files and scripts.', 'Yes', 'No').then(sel => {
            if (sel == 'Yes') {
                _cook(gamePath, modKitPath, workspacePath, modMergerPath);
            }
        });
    } else {
        _cook(gamePath, modKitPath, workspacePath, modMergerPath);
    }
}

export function uncook(args: any[]) {
}

export function publish(args: any[]) {
}