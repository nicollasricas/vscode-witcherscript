import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as utils from '../utils';
import { displayError, Errors } from '../errors';
import { Commands } from '../constants';
import { Configuration } from '../components/Configuration';

export function importScript(configuration: Configuration, arg: vscode.Uri) {
    if (!utils.isMod()) {
        return;
    }

    if (!arg) {
        return;
    }

    let workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    let gamePath = configuration.GamePath;

    if (!gamePath) {
        displayError(Errors.GamePathIsRequired);
        vscode.commands.executeCommand(Commands.ShowSettingsPage);
        return;
    }

    let modName = utils.getModName();

    let modScriptsDir = path.join(workspacePath, modName, "scripts");

    if (!fs.statSync(modScriptsDir).isDirectory()) {
        throw 'Invalid mod directory, make sure to create a mod using the "Witcher: New Mod" or import a existent one correctly.';
    }

    let dirToListScripts = "";

    let baseScriptsPath = path.join(gamePath, "content/content0/scripts/game");

    dirToListScripts = baseScriptsPath;

    if (arg.fsPath.startsWith(modScriptsDir)) {
        if (fs.statSync(arg.fsPath).isDirectory()) {
            dirToListScripts = (arg.fsPath + "/").replace(modScriptsDir, path.dirname(baseScriptsPath));
        } else {
            dirToListScripts = path.dirname(arg.fsPath + "/").replace(modScriptsDir, path.dirname(baseScriptsPath));
        }
    }

    const listScripts = (dir, files = []) => {
        fs.readdirSync(dir).map(file => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                listScripts(path.join(dir, file), files);
            } else {
                files.push(path.join(dir, file).replace(baseScriptsPath, "").substring(1).replace(/\\/gi, "/"));
            }
        });

        return files;
    };

    vscode.window.showQuickPick(listScripts(dirToListScripts), {
        placeHolder: "Select the script to import"
    }).then((selectedItem) => {
        const copyFile = (targetFile) => {
            try {
                var copyDirectory = path.dirname(targetFile);

                if (!fs.existsSync(copyDirectory)) {
                    fs.mkdirSync(copyDirectory);
                }

                fs.writeFileSync(targetFile, fs.readFileSync(path.join(baseScriptsPath, selectedItem)));

                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.parse(targetFile), false);
            } catch {

            }
        };

        var targetFile = path.join(modScriptsDir, "game", selectedItem);

        if (fs.existsSync(targetFile)) {
            vscode.window.showInformationMessage('The script you want import already exists, do you wanna override it?', 'Yes', 'No').then(sel => {
                if (sel == 'Yes') {
                    copyFile(targetFile);
                }
            });
        } else {
            copyFile(targetFile);
        }
    });
}